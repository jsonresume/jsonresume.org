import { BreadcrumbItem, Breadcrumbs } from '@jsonresume/ui';

export default function BreadcrumbsBasic() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="https://jsonresume.org">Home</BreadcrumbItem>
      <BreadcrumbItem href="https://jsonresume.org/themes">
        Themes
      </BreadcrumbItem>
      <BreadcrumbItem current>Pro</BreadcrumbItem>
    </Breadcrumbs>
  );
}
