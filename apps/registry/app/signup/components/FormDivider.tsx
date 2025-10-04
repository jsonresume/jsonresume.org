import { Separator } from '@repo/ui';

export const FormDivider = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-gray-50 px-2 text-muted-foreground">
          Or continue with email
        </span>
      </div>
    </div>
  );
};
