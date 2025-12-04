import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { ReactNode } from 'react';

interface ComponentSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ComponentSection({
  title,
  description,
  children,
}: ComponentSectionProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
