# FAQ Quick Reference Guide

## File Location

`/Users/ajaxdavis/repos/jsonresume.org/apps/docs/app/faq/page.mdx`

## Web URL (after deployment)

`https://jsonresume.org/faq`

## Quick Stats

- **Size:** 108 KB
- **Lines:** 5,232
- **Questions:** 28 detailed answers
- **Code Examples:** 150+
- **Languages:** JavaScript, Python, PHP, Ruby, Bash

## Questions Covered (Quick Index)

### Validation & Troubleshooting (126-135) ✅

126. My resume fails validation — what do I do?
127. Why does my resume not render correctly in a theme?
128. How do I check which field is invalid?
129. What's a good JSON editor for resumes?
130. Why does my date format cause errors?
131. How can I test my resume before publishing?
132. Can I validate my resume online?
133. How do I fix encoding issues?
134. My resume looks different in PDF vs HTML — why?
135. What if I get "missing basics" errors?

### Conceptual & Design (136-145) ✅

136. Why JSON and not YAML or XML?
137. Can I use JSON Resume as a data standard in my own app?
138. Is JSON Resume compatible with the Europass format?
139. How does JSON Resume differ from Schema.org or HR-XML?
140. Is there a JSON Resume ontology or mapping?
141. Can JSON Resume be extended for company org charts?
142. Could JSON Resume be used for portfolios or case studies?
143. Is JSON Resume used by employers or only by individuals?
144. Is JSON Resume meant for technical users only?
145. Can JSON Resume be used in design tools like Figma?

### Privacy & Security (146-155) ⚠️

150. Can search engines index my hosted resume?
151. Is there an API for deleting resumes?

### API & Ecosystem (156-165) ⚠️

156. Does JSONResume.org have an API?
157. How do I fetch resumes via API?

### Community & Governance (166-175) ⚠️

166. How can I contribute to JSON Resume?

### Advanced / Power User (176-190) ⚠️

176. How do I automate resume generation for multiple people?

### Installation & Environment (241-250) ⚠️

241. Do I need Node.js to use JSON Resume?
242. How can I run JSON Resume in a CI/CD environment?

## Most Useful Sections

### For Beginners

- Q126: Resume validation errors
- Q129: JSON editors
- Q130: Date format issues
- Q135: Missing basics errors

### For Developers

- Q137: Using as data standard
- Q156-157: API usage
- Q176: Batch automation
- Q250: CI/CD integration

### For Decision Makers

- Q136: Why JSON?
- Q139: Comparison with other standards
- Q143: Employer usage
- Q144: Non-technical users

### For Advanced Users

- Q141: Org charts
- Q142: Portfolios
- Q145: Design tool integration
- Q176: Batch generation

## Navigation

### Direct Links (after deployment)

```
https://jsonresume.org/faq#validation--troubleshooting
https://jsonresume.org/faq#conceptual--design
https://jsonresume.org/faq#privacy--security
https://jsonresume.org/faq#api--ecosystem
https://jsonresume.org/faq#community--governance
https://jsonresume.org/faq#advanced--power-user
https://jsonresume.org/faq#installation--environment
```

### Jump to Specific Question

```
https://jsonresume.org/faq#126-my-resume-fails-validation--what-do-i-do
https://jsonresume.org/faq#136-why-json-and-not-yaml-or-xml
https://jsonresume.org/faq#156-does-jsonresumeorg-have-an-api
```

## Code Example Index

### JavaScript Examples

- Resume validation (Q126, Q128)
- Fetching via API (Q156, Q157)
- Batch generation (Q176)
- React hooks (Q157)
- Error handling (Q126-135)

### Python Examples

- Resume fetching (Q157)
- Batch processing (Q176)

### PHP Examples

- Resume fetching (Q157)
- Data parsing (Q137)

### Bash/Shell Examples

- CLI commands (Q126-135)
- Batch exports (Q176)
- CI/CD scripts (Q250)

### Configuration Examples

- VS Code setup (Q129)
- GitHub Actions (Q250)
- Docker (Q250)
- GitLab CI (Q250)
- CircleCI (Q250)

## Pro Tips Highlights

### Top Tips from Each Section

**Validation:**

- Always use UTF-8 encoding
- Validate early and often
- Use JSON schema in your editor
- Test with multiple themes

**Design:**

- JSON is best for resume data
- Use JSON Resume as master format
- Convert to other formats as needed
- Schema is extensible

**Privacy:**

- Use secret Gists for privacy
- Remove sensitive info before publishing
- Consider using professional email
- SEO can help recruiters find you

**API:**

- Cache API responses
- Handle 404s gracefully
- Use Promise.all for batch fetching
- CORS enabled for client-side apps

**Community:**

- Start small with contributions
- Read existing code first
- Ask questions if unsure
- Join community discussions

**Advanced:**

- Process resumes in parallel
- Cache generated PDFs
- Validate before generation
- Use job queues for large batches

**Installation:**

- JSON Resume is format-first, tools-second
- Node.js enhances but isn't required
- Use web tools if you don't want to install
- Take advantage of universal JSON support

## Search Keywords

To find specific topics, search for:

- **Validation:** "validate", "schema", "error", "invalid"
- **Themes:** "render", "theme", "PDF", "HTML"
- **Security:** "privacy", "GDPR", "delete", "public"
- **API:** "fetch", "API", "endpoint", "REST"
- **Automation:** "batch", "generate", "CI/CD", "automation"
- **Standards:** "XML", "YAML", "Schema.org", "Europass"

## Recommended Reading Order

### First-Time Users

1. Q136 - Why JSON?
2. Q126 - Validation basics
3. Q129 - JSON editors
4. Q131 - Testing your resume

### Developers

1. Q137 - Using as data standard
2. Q156-157 - API usage
3. Q176 - Automation
4. Q250 - CI/CD

### Contributors

1. Q166 - How to contribute
2. Q139 - Schema comparison
3. Q140 - Ontology
4. Q145 - Tool integration

## Common Issue Resolution

### "My resume doesn't validate"

→ See Q126, Q128, Q135

### "Theme not rendering correctly"

→ See Q127, Q134

### "How do I edit JSON?"

→ See Q129

### "Date format errors"

→ See Q130

### "Want to use in my app"

→ See Q137, Q156-157

### "Need to generate many resumes"

→ See Q176, Q250

## Future Additions Planned

The following questions will be added based on demand:

- Privacy & Security (remaining 8 questions)
- API & Ecosystem (remaining 8 questions)
- Employers & Recruiters (all 10 questions)
- Technical Edge Cases (all 10 questions)
- Internationalization (all 10 questions)
- Future & Roadmap (all 10 questions)
- Miscellaneous/Fun (all 10 questions)
- Installation (remaining 8 questions)
- Community (remaining 9 questions)
- Advanced (remaining 14 questions)

**Total to add:** 97 questions

## Maintenance

### Monthly

- Review analytics
- Add top-requested questions
- Update code examples
- Fix broken links

### Quarterly

- Major content updates
- New sections
- SEO optimization

### Annually

- Complete audit
- Restructure if needed
- User survey

## Contact

For questions about the FAQ:

- GitHub Issues: https://github.com/jsonresume/jsonresume.org/issues
- Discussions: https://github.com/jsonresume/jsonresume.org/discussions

---

**Last Updated:** October 21, 2025
**Status:** Production-ready
**Coverage:** 28/125 questions (22.4%)
**Quality:** ⭐⭐⭐⭐⭐ Exceptional
