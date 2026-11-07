BEGIN READ ONLY;
SET LOCAL statement_timeout = '20s';
WITH current_profiles AS (
  SELECT p.username,
         CASE WHEN p.kind = 'account' AND p.source = 'stored'
              THEN p.stored_resume ELSE p.resume END AS resume
  FROM app.profiles p
  LEFT JOIN app.users u ON u.id = p.user_id
  WHERE p.kind = 'ghost' OR (p.kind = 'account'
    AND (u.email_verified_at IS NOT NULL OR u.github_id IS NOT NULL))
), legacy_profiles AS (
  SELECT DISTINCT ON (lower(r.username)) lower(r.username) AS username,
         r.resume::jsonb AS resume
  FROM public.resumes r
  WHERE pg_input_is_valid(r.resume, 'jsonb')
    AND NOT EXISTS (SELECT 1 FROM app.profiles p WHERE p.username = lower(r.username))
  ORDER BY lower(r.username), r.updated_at DESC NULLS LAST
), profiles AS (
  SELECT * FROM current_profiles UNION ALL SELECT * FROM legacy_profiles
), choices AS (
  SELECT CASE WHEN jsonb_typeof(resume->'meta'->'theme') = 'string'
              THEN CASE WHEN lower(resume->'meta'->>'theme') ~ '^[a-z0-9][a-z0-9-]{0,79}$'
                        THEN lower(resume->'meta'->>'theme') ELSE '(invalid theme name)' END
              ELSE 'elegant' END AS slug,
         jsonb_typeof(resume->'meta'->'theme') = 'string' AS explicit
  FROM profiles WHERE jsonb_typeof(resume) = 'object'
), adoption AS (
  SELECT slug, count(*)::int AS public_resumes,
         count(*) FILTER (WHERE explicit)::int AS explicit_choices,
         count(*) FILTER (WHERE explicit IS NOT TRUE)::int AS default_assignments
  FROM choices GROUP BY slug
), recent_views AS (
  SELECT lower(theme) AS slug, count(*)::int AS page_views,
         count(DISTINCT username)::int AS viewed_resumes
  FROM app.resume_views
  WHERE kind = 'page' AND viewed_at >= now() - interval '30 days'
  GROUP BY 1
)
SELECT json_build_object(
  'asOf', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
  'metric', 'Public resumes by stored theme choice, with absent choices assigned to the host default',
  'defaultTheme', 'elegant',
  'publicProfiles', (SELECT count(*) FROM profiles),
  'renderableDocuments', (SELECT count(*) FROM choices),
  'excludedDocuments', (SELECT count(*) FROM profiles WHERE jsonb_typeof(resume) IS DISTINCT FROM 'object'),
  'firstRecordedView', (SELECT min(viewed_at) FROM app.resume_views WHERE kind='page'),
  'viewWindowDays', 30,
  'choices', (SELECT json_agg(a ORDER BY public_resumes DESC, slug) FROM adoption a),
  'recentViews', (SELECT json_agg(v ORDER BY page_views DESC, slug) FROM recent_views v)
);
COMMIT;
