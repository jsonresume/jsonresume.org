import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { formatLocation } from '../../../utils/formatters';

export function ResumeList({ resumes }) {
  return (
    <div className="flex-1">
      <ScrollArea className="h-[80vh]">
        <div className="space-y-4">
          {resumes.map((resume, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/${resume.username}/dashboard`}>
                <Card>
                  <CardHeader>
                    <CardTitle>{resume.name}</CardTitle>
                    <CardDescription>
                      {formatLocation(resume.location)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Image
                        src={resume.image}
                        alt={resume.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        {resume.work && resume.work[0] && (
                          <p className="text-sm text-gray-600">
                            {resume.work[0].position} at{' '}
                            {resume.work[0].company}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
