/** Checks on who the person is: contact details, headline, schools. */
import { place, text } from '@repo/resume-formats/read';
import type { AtsCheck } from './report';
import { check, issue, need, type Entry } from './scoring';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const contact = (basics: Entry): AtsCheck =>
  check('contact', 'Contact details', 20, [
    need(
      !!text(basics['name']),
      6,
      issue('critical', 'basics.name', 'No name', 'Add your full name.')
    ),
    need(
      EMAIL.test(text(basics['email']) ?? ''),
      6,
      issue(
        'critical',
        'basics.email',
        'No email address, or not a valid one',
        'Add the email recruiters should use.'
      )
    ),
    need(
      !!text(basics['phone']),
      4,
      issue(
        'warning',
        'basics.phone',
        'No phone number',
        'Add a phone number, with the country code if you apply abroad.'
      )
    ),
    need(
      !!place(basics['location']),
      4,
      issue(
        'warning',
        'basics.location',
        'No location',
        'Add at least a city and country: many searches filter by place.'
      )
    ),
  ]);

export const summary = (basics: Entry): AtsCheck => {
  const about = text(basics['summary']) ?? '';
  return check('summary', 'Headline and summary', 10, [
    need(
      !!text(basics['label']),
      4,
      issue(
        'warning',
        'basics.label',
        'No headline',
        'Add the title you are looking for, e.g. "Senior Frontend Engineer".'
      )
    ),
    about.length >= 100
      ? [6]
      : about
      ? [
          3,
          issue(
            'tip',
            'basics.summary',
            'A very short summary',
            'Two or three sentences on what you do and your strongest skills.'
          ),
        ]
      : [
          0,
          issue(
            'warning',
            'basics.summary',
            'No summary',
            'Add a short summary with the words a recruiter would search for.'
          ),
        ],
  ]);
};

export const education = (schools: ReadonlyArray<Entry>): AtsCheck =>
  check('education', 'Education', 10, [
    need(
      schools.length > 0,
      4,
      issue(
        'tip',
        'education',
        'No education',
        'Add your degree, course or bootcamp, if you have one: some filters require it.'
      )
    ),
    need(
      schools.some(
        (e) =>
          text(e['institution']) && (text(e['area']) || text(e['studyType']))
      ),
      6,
      issue(
        'tip',
        'education',
        'No school with a field of study',
        'Give each entry an institution and an area or degree.'
      )
    ),
  ]);
