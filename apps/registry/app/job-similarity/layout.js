export const metadata = {
  title: 'Job Market Similarity Graph | JSON Resume Registry',
  description:
    'Interactive visualization of the tech job market, powered by data from HN "Who\'s Hiring" threads and JSON Resume Registry. Explore connections between different job roles and discover hiring trends.',
  openGraph: {
    title: 'Job Market Similarity Graph | JSON Resume Registry',
    description:
      'Interactive visualization of the tech job market, powered by data from HN "Who\'s Hiring" threads and JSON Resume Registry. Explore connections between different job roles and discover hiring trends.',
    images: [
      {
        url: 'https://i.imgur.com/W5G1fNG.png',
        width: 1200,
        height: 630,
        alt: 'Job Market Similarity Graph visualization showing connected nodes representing different tech job roles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Job Market Similarity Graph | JSON Resume Registry',
    description:
      'Interactive visualization of the tech job market, powered by data from HN "Who\'s Hiring" threads and JSON Resume Registry. Explore connections between different job roles and discover hiring trends.',
    images: ['https://i.imgur.com/W5G1fNG.png'],
  },
};

export default function Layout({ children }) {
  return children;
}
