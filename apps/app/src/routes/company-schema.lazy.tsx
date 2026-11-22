import { CompanySchemaPage } from '@repo/site/company-schema';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/_site/company-schema')({
  component: CompanySchemaPage,
});
