import { FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

/**
 * Resume summary card component
 * @param {string} summary - Resume summary text
 */
export function SummaryCard({ summary }) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg">{summary}</p>
      </CardContent>
    </Card>
  );
}
