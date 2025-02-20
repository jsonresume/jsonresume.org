import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For now, return sample jobs
    // In production, this would fetch from a database
    const jobs = [
      {
        id: "1",
        title: "Founding Frontend Engineer",
        company: "Pincites",
        type: "Full-time",
        remote: "Full",
        description: "Pincites uses AI to help legal teams identify negotiation patterns, align with GTM teams, and streamline contract reviews. Our mission is to close deals faster by transforming legal into a strategic partner through transparent, automated workflows that improve consistency and collaboration.",
        location: { countryCode: "US" },
        skills: [
          { name: "React", level: "Expert" },
          { name: "TypeScript", level: "Expert" },
          { name: "Next.js", level: "Expert" }
        ],
        qualifications: [
          "Proficiency with React, Typescript, CSS, Next.js",
          "Experience with LLMs"
        ]
      },
      {
        id: "2",
        title: "Senior Full-stack Django Developer",
        company: "Safety Cybersecurity",
        type: "Full-time",
        remote: "Full",
        description: "Seeking senior engineers for our products. Work on web platform or CLI/Firewall product with a strong team from Google, AWS, and Microsoft.",
        location: { countryCode: "CA" },
        skills: [
          { name: "Full-stack Development", level: "Expert" },
          { name: "Django", level: "Expert" },
          { name: "Python", level: "Expert" },
          { name: "React", level: "Expert" }
        ],
        qualifications: [
          "Experience in full-stack development",
          "Proficiency in Django and React"
        ]
      }
    ];

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
