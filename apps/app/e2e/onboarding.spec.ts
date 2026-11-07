import { expect, test } from '@playwright/test';

const unique = () => `e2e${Date.now().toString(36)}`;

test('a resume made on /start is saved as the new account’s first version', async ({
  page,
}) => {
  // Buttons work once the page has hydrated.
  await page.goto('/start', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Start writing' }).click();
  await page.getByLabel('Full name').fill('Grace Hopper');
  await page.getByLabel('Headline').fill('Computer Scientist');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Company').fill('Eckert-Mauchly');
  await page.getByLabel('Role').fill('Senior Mathematician');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Skills').fill('Programming: COBOL');
  await page.getByRole('button', { name: 'See it in a theme' }).click();
  await expect(
    page.frameLocator('iframe').getByText('Grace Hopper').first()
  ).toBeVisible({ timeout: 60_000 });

  await page.getByRole('link', { name: 'Save it and get your link' }).click();
  await expect(page).toHaveURL(/\/signup\?next=/);
  await page.waitForLoadState('networkidle');
  const user = unique();
  await page.getByLabel('Username').fill(user);
  await page.getByLabel('Email').fill(`${user}@example.test`);
  await page.getByLabel('Password').fill('correct horse battery staple');
  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page.getByText(/^Saved\./)).toBeVisible({
    timeout: 60_000,
  });
  const saved = await page.request.get('/api/editor/resume');
  expect(await saved.json()).toMatchObject({
    resume: {
      basics: { name: 'Grace Hopper', label: 'Computer Scientist' },
      work: [{ name: 'Eckert-Mauchly', position: 'Senior Mathematician' }],
      skills: [{ name: 'Programming', keywords: ['COBOL'] }],
    },
  });
});

test('an app’s request survives sign-up and returns to the app with a code', async ({
  page,
}) => {
  const callback = 'https://app.example.test/callback';
  const registered = await page.request.post('/api/oauth/register', {
    data: { client_name: 'E2E App', redirect_uris: [callback] },
  });
  const { client_id } = (await registered.json()) as { client_id: string };
  const authorize = new URLSearchParams({
    response_type: 'code',
    client_id,
    redirect_uri: callback,
    scope: 'resume:read',
    state: 'xyz',
    code_challenge: 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
    code_challenge_method: 'S256',
  });
  await page.route('https://app.example.test/**', (route) =>
    route.fulfill({ body: 'back at the app' })
  );

  await page.goto(`/oauth/authorize?${authorize}`, {
    waitUntil: 'networkidle',
  });
  // Signed out, the request waits on this page while you sign up.
  await expect(page.getByText('Sign in to let E2E App')).toBeVisible();
  await page.getByRole('link', { name: 'Create an account' }).click();
  await expect(page).toHaveURL(/\/signup\?next=/);
  await page.waitForLoadState('networkidle');
  const user = unique();
  await page.getByLabel('Username').fill(user);
  await page.getByLabel('Email').fill(`${user}@example.test`);
  await page.getByLabel('Password').fill('correct horse battery staple');
  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page.getByText('E2E App')).toBeVisible({ timeout: 60_000 });
  await page.getByRole('button', { name: 'Allow' }).click();
  await expect(page).toHaveURL(/^https:\/\/app\.example\.test\/callback\?/);
  const back = new URL(page.url());
  expect(back.searchParams.get('code')).toBeTruthy();
  expect(back.searchParams.get('state')).toBe('xyz');
});
