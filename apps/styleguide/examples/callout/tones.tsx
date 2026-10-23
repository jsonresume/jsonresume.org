import { Callout, Code, Stack } from '@jsonresume/ui';

export default function CalloutTones() {
  return (
    <Stack gap={3}>
      <Callout title="Tip">
        Name your gist <Code>resume.json</Code> and the registry finds it
        automatically.
      </Callout>
      <Callout tone="brand" title="New in schema 1.7">
        Publications can list authors, volume, issue, pages and a DOI.
      </Callout>
      <Callout tone="success">Your resume is valid.</Callout>
      <Callout tone="warning" title="Deprecated field">
        <Code>projects[].description</Code> still works, but use{' '}
        <Code>summary</Code>.
      </Callout>
      <Callout tone="danger" title="Validation failed">
        <Code>basics.email</Code> must be a string.
      </Callout>
    </Stack>
  );
}
