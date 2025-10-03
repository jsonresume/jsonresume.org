import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@repo/ui/components/ui/card';
import { features } from '../data/features';

export const FeaturesGrid = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <Card
            key={i}
            className="group hover:shadow-lg transition-shadow duration-300 border-none"
          >
            <CardHeader>
              <div
                className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                {feature.icon}
              </div>
              <CardTitle className="flex items-center gap-2 text-xl">
                {feature.title}
              </CardTitle>
              <CardDescription className="text-base">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
