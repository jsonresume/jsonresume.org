/** Synthetic content to exercise script shaping and mixed-direction contacts. */
const records: Record<string, [string, string, string, string]> = {
  'arabic-modern': [
    'ليلى حسن',
    'مهندسة برمجيات',
    'العمل مع فرق دولية لتطوير خدمات سهلة الاستخدام.',
    'الرياض',
  ],
  'cjk-modern': [
    '田中 美咲',
    'ソフトウェアエンジニア',
    '誰もが使いやすいサービスを開発し、国際的なチームと協力しています。',
    '東京',
  ],
  'indic-modern': [
    'आशा शर्मा',
    'सॉफ्टवेयर इंजीनियर',
    'अंतरराष्ट्रीय टीमों के साथ सुलभ और विश्वसनीय सेवाओं का निर्माण।',
    'नई दिल्ली',
  ],
  'korean-modern': [
    '김민서',
    '소프트웨어 엔지니어',
    '다양한 팀과 협력하여 접근성이 좋은 서비스를 개발합니다.',
    '서울',
  ],
};
export function regionalFixture(slug: string) {
  const row = records[slug];
  if (!row) return {};
  const [name, label, summary, city] = row;
  return {
    regional: {
      basics: {
        name,
        label,
        summary,
        email: 'candidate@example.com',
        url: 'https://example.com/portfolio',
        location: { city },
      },
      work: [
        {
          position: label,
          name: 'International Studio',
          startDate: '2021-03',
          summary,
        },
      ],
      projects: [{ name: 'REGIONAL-SENTINEL', description: summary }],
      skills: [
        { name: 'Web', keywords: ['TypeScript', 'React', 'Accessibility'] },
      ],
      education: [
        {
          institution: 'International University',
          area: label,
          studyType: 'BSc',
          startDate: '2016',
          endDate: '2020',
        },
      ],
    },
  };
}
