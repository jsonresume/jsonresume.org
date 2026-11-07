# Resume theme research and priorities for JSON Resume

Research date: 7 November 2026.

JSON Resume should offer a small set of recognisable, well-executed resume families, with reliable exports and meaningful differences in how they organise information. The strongest first investments are a conventional bullet resume, a compact technical resume, an accented professional resume, and a choice of light or dark sidebar layouts.

The ten choices below are ranked by their value to a JSON Resume catalogue. They are not a claimed global popularity ranking or a ranking of interview conversion. Public evidence supports demand for these designs much more strongly than it supports claims that one named template causes better hiring outcomes.

The scope is primarily resumes submitted for jobs, including their PDF form. Academic CVs and European applications receive separate specialist choices. A personal website can support additional interaction and visual expression; those features do not establish that its printed resume performs well.

## How to interpret the evidence

Four different signals matter:

| Signal                                                    | What it can establish                                        | What it cannot establish                                 |
| --------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| Recorded applications and interview outcomes              | Associations between formatting and progression              | Causality without suitable controls or randomisation     |
| ATS vendor documentation and parser evaluations           | Specific extraction capabilities and failure modes           | Universal compatibility or employer selection decisions  |
| Template selections, downloads, stars and forks           | Demand, distribution or interest within a particular channel | Unique active applicants, satisfaction or hiring success |
| University guidance and established template distribution | Institutional support and enduring conventions               | Market share or comparative interview conversion         |

GitHub favours technical users. Commercial builders favour the templates they display, promote and make available. Institutional formats may be adopted because they are required. These selection effects prevent combining the numbers into one meaningful score.

Resume.io's search-indexed homepage reports approximately 12 million selections for Stockholm/Essential, 7.5 million for Dublin/Professional and 5.2 million for New York/Corporate. These are vendor claims with no disclosed counting period or deduplication method. The live gallery confirms the layouts and renamed labels; the counters were available in indexed page text, not the browser view inspected. Treat their scale and relative ordering as provisional demand signals. [Resume.io](https://resume.io/), [template gallery](https://resume.io/resume-templates)

## What the research says about effectiveness

Huntr examined 94,338 applications from 9,264 users, covering October 2024 through April 2026. Recorded interview rates were 6.2% for two columns and 5.7% for one; no reliable layout advantage survived its checks. Its seven templates also produced no reliable winner. The analysis accounted for repeated applications, compared groups, and examined changes within the same applicant. Outcomes were self-reported, the study was observational, and the actual submitted files and employer parsing results were not verified. This supports offering readable alternatives without promising a conversion advantage. It does not show that every possible design is equally effective. [Huntr methodology and results](https://huntr.co/research/best-resume-format)

Preference is also different from selection. A 2017 study reported that participants thought text-only resumes would be more effective, but found no reliable effect of graphical design on simulated selection decisions. The public abstract does not establish real hiring outcomes. [Popham and colleagues](https://journals.sagepub.com/doi/10.1177/1541931213601792)

A contrasting 2026 vendor experiment reported large differences in shortlisting across six similarly qualified candidates. Only 13 of 20 recruiter sessions were retained. Wording, information placement and candidate details varied alongside layout, so it cannot isolate a column or typography effect. Its useful hypothesis is that scattering the evidence needed for a particular vacancy makes screening harder. Its claimed winning format should not be treated as independently established. [Specific Resume experiment and methodology](https://www.specificresume.com/research/blind-format-test)

Parsing is a separate engineering problem. Greenhouse explicitly lists columns, graphics, complex tables and contact information in headers or text boxes among possible causes of incomplete parsing. It also explains that an unsuccessfully parsed resume can remain attached to the candidate. A parsing failure is not synonymous with automatic rejection. [Greenhouse support](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse)

Textkernel provides the useful counterpoint: its engineering evaluation increased well-rendered CVs from 62% to 90% on a roughly 700-CV test set after improving column detection. This demonstrates that column handling is a real, improving capability with remaining errors, rather than universally impossible or universally solved. The percentage is a rendering result for that evaluation, not an ATS pass rate for a template. [Textkernel engineering report](https://www.textkernel.com/learn-support/blog/improving-extraction-from-column-resumes/)

Enhancv reports that 44 of 60 successful applications in a June 2026 sample used two columns. This establishes that success with two columns occurs; selecting successful applicants supplies no denominator for comparing success rates. Its blanket claim that modern systems read columns correctly is broader than Greenhouse's own documentation supports. [Enhancv success sample](https://enhancv.com/blog/ats-resume-parsing/)

## The ten recommended theme families

The audience fit and design adaptations in this section are product judgments based on the references. They are not measured hiring advantages.

| Priority | Family and reference                            | Main audience                                     | Evidence of demand or institutional use                  | Main constraint                               |
| -------- | ----------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------- |
| 1        | Conventional bullet resume — Harvard            | Broad professional and graduate applications      | Official career-service distribution                     | Keep it readable as content grows             |
| 2        | Compact technical resume — Jake's               | Software, engineering, internships                | About 2.8k stars and 738 forks                           | Avoid shrinking everything onto one page      |
| 3        | Accented professional resume — Awesome-CV       | Technical and business professionals              | About 28.9k stars and 5.3k forks                         | Control small text and visual clutter         |
| 4        | Light sidebar — Stockholm/Essential             | General professional use                          | Vendor reports about 12m selections                      | Preserve reading order and main-column width  |
| 5        | Dark sidebar — Dublin/Professional              | Users seeking more visual identity                | Vendor reports about 7.5m selections                     | Contrast, printing and sidebar overflow       |
| 6        | Compact asymmetric technical layout — Deedy     | Early-career technical applicants                 | About 5.1k stars and 1.3k forks                          | Uneven column lengths and overflow            |
| 7        | Achievement sidebar — AltaCV                    | Applicants with varied accomplishments            | About 1.6k stars, 387 forks and Overleaf staff selection | Avoid decorative skill ratings and filler     |
| 8        | Restrained career timeline — New York/Corporate | Applicants presenting career progression          | Vendor reports about 5.2m selections                     | Keep chronology in a simple reading sequence  |
| 9        | Academic date-gutter CV — moderncv              | Researchers and academic applicants               | Long-standing TeX distribution and maintenance           | Handle publications and multiple pages well   |
| 10       | Structured European CV — Europass               | Applications benefiting from Europass conventions | Official platform reports millions of downloads          | Regional fit and explicit format requirements |

### 1 Conventional bullet resume based on Harvard

**Why it belongs:** Harvard distributes an official bullet template in Word, accessible Word and Google Docs formats. This is institutional backing, not a measured popularity ranking. It supplies a credible reference for a broadly useful baseline. [Official template](https://careerservices.fas.harvard.edu/resources/bullet-point-resume-template/)

**Visual direction:** A restrained masthead, a continuous reading column, clear section divisions, and consistent employer, role and date treatments. Let typography and spacing carry the hierarchy.

**Why I would prioritise it:** It gives the catalogue a dependable option for applicants who want the reader to concentrate on their experience. Its broad content area accommodates detailed accomplishment bullets without repeatedly wrapping short phrases.

**Agent brief:** Create student and experienced section-order presets within the same visual family. Education-first should be an option rather than a fixed assumption. Support a second page gracefully. Do not add a photo panel, ratings, a dashboard-style summary or oversized branding to make the example look more exciting.

**Tradeoff:** It offers less visual differentiation. Its quality depends on disciplined alignment, line lengths and pagination; a plain layout can still be poorly executed.

### 2 Compact technical resume based on Jake's Resume

**Why it belongs:** The original repository shows roughly 2.8k stars and 738 forks, and the template is distributed on Overleaf. The repository was archived in August 2024, so it is a design reference rather than a current software dependency. [Repository](https://github.com/jakegut/resume), [Overleaf template and preview](https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs)

**Visual direction:** Compact monochrome typography, thin rules under section titles, right-aligned dates, concise project entries and grouped technical skills.

**Why I would prioritise it:** It gives projects comparable structural importance to employment. That is a useful difference from a general business resume when an applicant's strongest evidence includes software, research or practical technical work.

**Agent brief:** Make project links and technology lists readable as text. Keep employer, job and dates together in extracted text. Allow experience-first and education-first variants, and allow more than one page when the content needs it.

**Tradeoff:** The familiar dense presentation becomes tiring when too many bullets are added. Preserve the compact character without silently reducing body type or discarding content.

### 3 Accented professional resume based on Awesome-CV

**Why it belongs:** With approximately 28.9k stars and 5.3k forks, Awesome-CV has the strongest GitHub interest signal among the named resume templates inspected. Stars are interest, not verified applicants. [Original project and previews](https://github.com/posquit0/Awesome-CV)

**Visual direction:** A prominent typographic name, restrained accent colour, clear section treatments and carefully aligned entries. Preserve its polished document character rather than reproducing every decorative element.

**Why I would prioritise it:** This is the useful middle ground for users who find a conventional resume too austere but still want the professional history to dominate. It also serves a different taste from both Jake's compact utilitarian layout and the sidebar families.

**Agent brief:** Give it a strong monochrome appearance as well as one accent colour. Use readable text labels with any icons. Keep summary length under the user's control and preserve usable links in both web and PDF forms.

**Tradeoff:** Thin, small or pale typography can undermine the elegant appearance when printed. The adaptation should prioritise comfortable body text and robust font loading.

### 4 Light sidebar based on Stockholm Essential

**Why it belongs:** Stockholm is presented as Essential in the current gallery. Its reported selection count is the largest among the three sidebar references included here; the measurement limitations are stated above. [Resume.io homepage](https://resume.io/)

**Visual direction:** A wide experience column, a narrow unfilled right rail for short supporting information, a compact identity area, ample white background and restrained accent colour. [Visual reference](https://resume.io/resume-templates)

**Why I would prioritise it:** It offers visible structure without a large coloured panel. The rail can gather short lists while leaving the main column for evidence about the candidate's work.

**Agent brief:** Keep achievements, employers and job dates together in the main column. Use the rail for supporting skills, languages or concise contact details. Offer a single-column export using the same content. Remove the rail when its content is empty.

**Tradeoff:** A long skill list can dominate the page while squeezing the employment narrative. The rail is useful only if its contents are brief and intentionally selected.

### 5 Dark sidebar based on Dublin Professional

**Why it belongs:** Dublin appears as Professional in the current gallery and has a substantial vendor-reported selection count. [Resume.io homepage](https://resume.io/)

**Visual direction:** A solid dark left sidebar contrasting with a white employment column. The reference places identity and short supporting information in the sidebar. [Visual reference](https://resume.io/resume-templates)

**Why I would include it:** It meets a clear desire for visual personality through one strong structural feature. It is visibly distinct from the lighter Stockholm family without requiring an unconventional work-history layout.

**Agent brief:** Use high contrast, text-based skill descriptions and a photo-optional composition. Keep the name and contact information in the normal document reading sequence. Provide a version suitable for monochrome printing.

**Tradeoff:** Filled panels consume ink and can reproduce badly. A narrow rail cannot accommodate arbitrary URLs or long descriptions. Do not use skill meters merely because the reference includes them.

### 6 Compact asymmetric technical resume based on Deedy

**Why it belongs:** Deedy has approximately 5.1k stars and 1.3k forks. The author explicitly designed it as a one-page asymmetric layout for undergraduate computer-science applicants. Its documented overflow issue is relevant to a JSON Resume adaptation. [Original project](https://github.com/deedy/Deedy-Resume)

**Visual direction:** A large name across the top, an unfilled narrow left column for education and skills, and a wider right column for employment and projects. The character comes from compact typography and column proportion.

**Why it remains distinct:** Unlike a general-purpose light sidebar, it is organised around short technical credentials and a compact early-career narrative. Its established developer audience makes it a relevant catalogue option even if another sidebar theme has greater general reach.

**Agent brief:** Preserve that compact technical identity, but replace fragile fixed-height behaviour with intentional continuation pages. On mobile, choose an explicit reading order. Make dense and comfortable spacing selectable.

**Tradeoff:** It is a weaker fit for lengthy management histories. Uneven columns waste space, and trying to force a long career into the original one-page premise can make the result unreadable.

### 7 Achievement sidebar based on AltaCV

**Why it belongs:** AltaCV shows about 1.6k stars and 387 forks and is an Overleaf staff pick. It derives from an Enhancv-inspired editorial reconstruction of Marissa Mayer's CV; that example should not be represented as her actual application resume. [Repository](https://github.com/liantze/AltaCV), [Overleaf selection](https://www.overleaf.com/gallery/tagged/cv)

**Visual direction:** A prominent name and tagline, accent-coloured headings, a main experience column and a supporting column of achievements, education or other short sections. [Template preview](https://www.overleaf.com/latex/templates/altacv-template/trgqjpwnmtgv)

**Why I would include it:** It gives awards, publications, volunteering and distinctive accomplishments a deliberate place. That can serve applicants whose relevant evidence extends beyond a sequence of employers.

**Agent brief:** Build the supporting column from actual JSON Resume content. Keep it optional. Replace arbitrary ratings with explicit proficiency descriptions and avoid invented achievement summaries.

**Tradeoff:** The sample's lifestyle chart, quotation and decorative blocks are poor defaults for a general application. The valuable feature is the flexible information hierarchy; decorative filler should not displace evidence.

### 8 Restrained career timeline based on New York Corporate

**Why it belongs:** New York is labelled Corporate in the current gallery and has a substantial vendor-reported selection count. The gallery identifies its timeline structure. [Resume.io homepage](https://resume.io/), [gallery reference](https://resume.io/resume-templates)

**Visual direction:** A formal identity area, quiet supporting rail and subtle vertical progression through employment. Use the timeline as a visual aid attached to ordinary job entries.

**Why I would include it:** It provides an additional formal style for applicants who want to emphasise progression and promotions. That is a plausible product fit, not evidence that a timeline earns more interviews.

**Agent brief:** Keep every role in one consistent reading direction. Make dates explicit beside the corresponding job. Group promotions under employers where the data permits. Make the decorative rule removable without losing information.

**Tradeoff:** Alternating entries across a central spine would make comparison and extraction harder. Multiple concurrent roles also need careful treatment; the visual should not imply a false sequence.

### 9 Academic date-gutter CV based on moderncv

**Why it belongs:** moderncv has a long maintenance history and ships through TeX Live and MiKTeX. This is evidence of established distribution, not a count of users. Its classic family provides a useful reference for extended structured records. [CTAN package](https://ctan.org/pkg/moderncv?lang=en), [sample PDF](https://www.overleaf.com/latex/templates/moderncv-and-cover-letter-template/sttkgjcysttn.pdf)

**Visual direction:** A restrained masthead, a narrow date gutter, a wide descriptive area, repeatable sections and predictable continuation pages.

**Why it deserves a specialist place:** Academic CVs need room for publications, research, teaching and grants. Oxford explicitly distinguishes their length and section requirements from ordinary employment CVs. [Oxford careers guide](https://www.careers.ox.ac.uk/sitefiles/oxford-guide-to-careers-2026.pdf)

**Agent brief:** Support long publication titles, URLs and many entries without overlap. Keep source order when it matters. Provide deliberate pagination, text labels and consistent continuation headings. Treat the academic adaptation as a content system as much as a font choice.

**Tradeoff:** It is unnecessarily extensive for many ordinary applications. The sample's contact glyphs and date gutter require extraction checks; TeX distribution does not certify ATS compatibility.

### 10 Structured European CV based on Europass

**Why it belongs:** The official statistics page reports 10.6 million accounts and more than nine million CV downloads labelled for 2026. Downloads are not distinct users. Europass supports CV creation in 31 languages. These are strong platform-use and localisation signals, not a preference vote for one visual template. [Official statistics](https://europass.europa.eu/en/europass-statistics-summary), [CV service](https://europass.europa.eu/en/create-europass-cv)

**Visual direction:** Explicit section labels, clearly associated dates and organisations, readable qualifications and languages, and space for extended records. Europass now offers multiple designs; do not assume the historic appearance is the only current form.

**Why I would include it conditionally:** It serves applicants whose target institution requests Europass or whose workflow benefits from its familiar structure. The adoption evidence is too substantial to ignore in a globally oriented catalogue.

**Agent brief:** Prioritise localisation, date formats and language information. Describe an independently implemented look as Europass-inspired; visual similarity alone does not establish official file-format compatibility.

**Tradeoff:** It should not be the universal default. A country, institution or posting can have different requirements, and an inspired theme cannot replace an explicitly required official Europass submission.

## Alternatives considered

**FlowCV:** Its Classic Sans is a useful minimalist reference, but the published 5.3-million-user claim is platform-wide. Without a per-template measure, it does not establish that this particular style outranks the named candidates. It can inform a sans-serif variant of the conventional family. [Classic Sans](https://flowcv.com/resume-template/classic-sans)

**Commercial template lists and Canva aesthetics:** Availability in a large gallery is a discovery signal. It is insufficient evidence that a specific template is preferred or performs well. Product-wide reviews also conflate ease of editing, export pricing and support with the design itself.

**Infographic resumes:** Charts, rating dots and graphical timelines can be attractive, but neither the outcome evidence reviewed nor the parser documentation justifies making them the general default. Use portfolio links to support work samples without turning essential qualifications into graphics.

**Skills-only functional resumes:** A theme can support a prominent skills section while preserving employers and dates. Hiding chronology should not be a default visual choice. Content organisation deserves its own decision rather than being silently imposed by a theme.

**Existing JSON Resume themes:** The public gallery already includes Professional, Pro, Sidebar, Academic CV Lite and other related options. It supplies no public per-theme adoption ranking. Treat the ten families as an audit and improvement framework before commissioning ten additional packages. [JSON Resume gallery](https://jsonresume.org/themes)

## Recommended build sequence

Start with Harvard-style conventional, Jake-style technical, Awesome-style accented, Stockholm-style light sidebar and Dublin-style dark sidebar. These cover a useful range of content needs and visual preferences. Use the same representative resume data when comparing them.

Then add Deedy and AltaCV when their distinctions survive an actual side-by-side comparison. Add the restrained timeline after the underlying chronology works well without decoration. Build academic and Europass-inspired options for explicit audiences, with the specialist fields and localisation they require.

Existing packages should be assessed before creating duplicates. In this checkout, the README descriptions for `jsonresume-theme-modern-classic` and `jsonresume-theme-academic-cv-lite` overlap parts of this brief. That is a documentation-level match, not a visual or quality audit of their implementation.

## Requirements for the theme building agents

These are proposed product acceptance criteria, not claims that the research experimentally proved each choice.

1. **Separate visual style from content policy.** Let users control section order, photo presence and what content appears. Do not silently omit supported sections to fit a sample layout.
2. **Compare with varied content.** Include an early-career applicant, a professional with a longer history, a researcher with publications, sparse data, long names and URLs, and multilingual text. Use appropriate scripts for the languages the theme claims to support.
3. **Check both A4 and US Letter.** Test one-, two- and longer-page outputs. Prevent stranded section headings, clipped bullets and unintentional blank pages.
4. **Keep content as real text.** Names, contacts, role titles, dates, skills and qualifications must remain selectable. Decorative elements must not be the only representation of meaning.
5. **Check extraction and associations.** Verify that job titles remain with their employers and dates. Plain-text extraction is a useful smoke test, not proof that every employer's ATS will parse the file correctly.
6. **Give sidebar designs a deliberate reading order.** Define their mobile and print behaviour. Offer a conventional single-column export where useful, and test that it retains the same information.
7. **Make typography usable before making it compact.** Start with comfortable body text and sufficient contrast. Resolve overflow through layout and content controls before reducing type size.
8. **Make optional elements truly optional.** Removing a photo, summary, skills section or sidebar must leave a complete composition rather than an empty hole.
9. **Evaluate real retrieval tasks.** Ask readers to locate the latest employer, role, dates and relevant accomplishment. Compare accuracy and time; an aesthetic preference question measures a different outcome.
10. **Measure catalogue use separately from success.** Track preview exposure, selections and exports as distinct events. Randomise gallery order when testing preference. Any optional interview-outcome study should record its selection biases and avoid implying causality from raw conversion rates.

For implementation conventions, use the repository's [theme creation guide](CREATING_A_THEME.md). The recommendations here describe the target design and evidence; they do not replace the shared rendering, schema coverage or export checks.

The practical priority is to give users recognisable choices whose content remains legible and complete across formats. A theme earns its place through distinct usefulness and reliable output, not through an unsupported ATS score or a claim that its appearance gets people hired.
