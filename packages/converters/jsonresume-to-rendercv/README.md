# @jsonresume/jsonresume-to-rendercv

Convert a [JSON Resume](https://jsonresume.org) `resume.json` into the YAML
input format of [RenderCV](https://github.com/rendercv/rendercv).

The registry serves the same output at
`https://registry.jsonresume.org/<username>.rendercv`.

## CLI

```bash
npx @jsonresume/jsonresume-to-rendercv resume.json            # writes resume.yaml
npx @jsonresume/jsonresume-to-rendercv resume.json Jane_CV.yaml
rendercv render Jane_CV.yaml
```

## Library

```js
import { convert } from '@jsonresume/jsonresume-to-rendercv';

const yaml = await convert(resume); // a RenderCV YAML string
```

## Field mapping

| JSON Resume | RenderCV |
| --- | --- |
| `basics.name`, `email`, `url` | `cv.name`, `email`, `website` |
| `basics.phone` | `cv.phone`, only if in international form (`+<country code> ...`); RenderCV rejects local numbers |
| `basics.location.city`, `countryCode` | `cv.location` ("City, CC") |
| `basics.profiles` | `cv.social_networks` (networks RenderCV supports, matched case-insensitively) |
| `basics.summary` | `sections.summary` |
| `education[]` | `sections.education` (`studyType` → `degree`, `courses` → `highlights`) |
| `work[]` | `sections.experience` (`name` → `company`) |
| `publications[]` | `sections.publications` (`name` → `title`, `publisher` → `journal`, `releaseDate` → `date`; `authors` is set to `[basics.name]`, since JSON Resume publications have no authors) |
| `projects[]` | `sections.projects` (`description` → `highlights`) |
| `awards[]` | `sections.additional_experience_and_awards` |
| `skills[]` named `Languages` / `Software` | `sections.technologies` |

Other sections (volunteer, certificates, languages, interests, references) are
not mapped yet.

Source: [packages/converters/jsonresume-to-rendercv](https://github.com/jsonresume/jsonresume.org/tree/master/packages/converters/jsonresume-to-rendercv)
in the jsonresume.org monorepo.
