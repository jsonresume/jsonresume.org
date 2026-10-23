import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  Badge,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Callout,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  CodeBlock,
  Container,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Divider,
  EmptyState,
  Feature,
  Field,
  Grid,
  Heading,
  Hero,
  Input,
  Link,
  Logo,
  NavList,
  NavListItem,
  PageHeader,
  Progress,
  Prose,
  Section,
  Select,
  SiteFooter,
  SiteHeader,
  SiteHeaderLink,
  SkipLink,
  Spinner,
  Stack,
  Switch,
  Table,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Td,
  Text,
  Textarea,
  Th,
  Tooltip,
  TooltipProvider,
} from '../index';
import { axeViolations } from '../test/axe';

describe('typography', () => {
  it('maps heading level to element and size independently', () => {
    render(
      <Heading level={1} size="display">
        JSON Resume
      </Heading>
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'JSON Resume' })
    ).toBeInTheDocument();
  });

  it('marks external links and opens them safely', () => {
    render(
      <Link href="https://github.com/jsonresume" external>
        GitHub
      </Link>
    );
    const link = screen.getByRole('link', {
      name: /GitHub.*opens in a new tab/,
    });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer noopener');
  });

  it('renders Text as the requested element', () => {
    render(<Text as="span">Hi</Text>);
    expect(screen.getByText('Hi').tagName).toBe('SPAN');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <main>
        <Heading level={1}>Title</Heading>
        <Text tone="muted">Body</Text>
        <Prose>
          <h2>Section</h2>
          <p>
            Read the <a href="/schema">schema</a>.
          </p>
        </Prose>
      </main>
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('site', () => {
  it('collapses navigation behind an accessible menu button', async () => {
    render(
      <SiteHeader brand={<Logo />}>
        <SiteHeaderLink href="/schema" active>
          Schema
        </SiteHeaderLink>
        <SiteHeaderLink href="/themes">Themes</SiteHeaderLink>
      </SiteHeader>
    );
    const toggle = screen.getByRole('button', { name: 'Menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    const region = document.getElementById(
      toggle.getAttribute('aria-controls') ?? ''
    );
    expect(region).toContainElement(nav);
    expect(within(nav).getByRole('link', { name: 'Schema' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('renders the wordmark linking home', () => {
    render(<Logo />);
    expect(screen.getByRole('link', { name: 'JSON Resume' })).toHaveAttribute(
      'href',
      '/'
    );
  });

  it('has no axe violations across the site chrome', async () => {
    const { container } = render(
      <div>
        <SkipLink />
        <SiteHeader brand={<Logo mark />} actions={<Button>Sign in</Button>}>
          <SiteHeaderLink href="/">Home</SiteHeaderLink>
        </SiteHeader>
        <main id="main">
          <Hero
            title="JSON Resume"
            lede="The open-source standard."
            actions={<Button variant="primary">Read more</Button>}
          />
          <PageHeader title="Schema" description="The format." eyebrow="Docs" />
          <Section tone="subtle">
            <Container>
              <Grid>
                <Feature title="Themes" action={<Button>View themes</Button>}>
                  Browse the gallery.
                </Feature>
              </Grid>
            </Container>
          </Section>
        </main>
        <SiteFooter
          links={[
            <a key="gh" href="https://github.com">
              GitHub
            </a>,
          ]}
          note="Open source"
        />
      </div>
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('forms', () => {
  it('wires label, hint, error and required state to the control', () => {
    render(
      <Field
        label="Email"
        hint="We never share it."
        error="Enter a valid email."
        required
      >
        <Input type="email" />
      </Field>
    );
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(
      'We never share it. Enter a valid email.'
    );
  });

  it('keeps an explicit id and description on the control', () => {
    render(
      <>
        <p id="extra">Extra</p>
        <Field label="Name" id="name-input">
          <Input aria-describedby="extra" />
        </Field>
      </>
    );
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveAttribute('id', 'name-input');
    expect(input).toHaveAccessibleDescription('Extra');
  });

  it('toggles checkbox and switch by their labels', async () => {
    render(
      <>
        <Checkbox label="Public resume" />
        <Switch label="Dark mode" />
      </>
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Public resume' });
    await userEvent.click(screen.getByText('Public resume'));
    expect(checkbox).toBeChecked();
    const toggle = screen.getByRole('switch', { name: 'Dark mode' });
    await userEvent.click(toggle);
    expect(toggle).toBeChecked();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <form>
        <Field label="Name">
          <Input />
        </Field>
        <Field label="Summary" hint="A sentence or two.">
          <Textarea />
        </Field>
        <Field label="Theme">
          <Select defaultValue="pro">
            <option value="pro">Pro</option>
            <option value="even">Even</option>
          </Select>
        </Field>
        <Checkbox label="Agree" />
        <Switch label="Notify me" />
      </form>
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('display', () => {
  it('exposes progress values', () => {
    render(<Progress label="Upload" value={150} />);
    const bar = screen.getByRole('progressbar', { name: 'Upload' });
    expect(bar).toHaveAttribute('aria-valuenow', '100');
  });

  it('announces spinners', () => {
    render(<Spinner label="Saving" />);
    expect(screen.getByRole('status')).toHaveTextContent('Saving');
  });

  it('falls back to initials with an accessible name', () => {
    render(<Avatar name="Thomas Davis" />);
    expect(screen.getByRole('img', { name: 'Thomas Davis' })).toHaveTextContent(
      'TD'
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <main>
        <Badge tone="brand">New</Badge>
        <Callout tone="warning" title="Heads up">
          Back up your resume.
        </Callout>
        <Card>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
          </CardHeader>
          <CardContent>A typeset theme.</CardContent>
        </Card>
        <EmptyState title="No resumes yet">
          Create one to get started.
        </EmptyState>
        <Table caption="Themes">
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Author</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Pro</Td>
              <Td>JSON Resume</Td>
            </tr>
          </tbody>
        </Table>
        <Avatar name="Ada" src="https://example.com/a.png" />
        <Stack direction="row" gap={2}>
          <Divider orientation="vertical" />
        </Stack>
        <Progress label="Upload" value={40} />
      </main>
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('interactive', () => {
  it('opens a dialog, moves focus into it and closes on Escape', async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Delete resume</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Delete resume?</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Delete resume' })
    );
    const dialog = screen.getByRole('dialog', { name: 'Delete resume?' });
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(await axeViolations(dialog)).toEqual([]);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('switches tabs with the keyboard', async () => {
    render(
      <Tabs defaultValue="json">
        <TabsList aria-label="Format">
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="yaml">YAML</TabsTrigger>
        </TabsList>
        <TabsContent value="json">json body</TabsContent>
        <TabsContent value="yaml">yaml body</TabsContent>
      </Tabs>
    );
    await userEvent.click(screen.getByRole('tab', { name: 'JSON' }));
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'YAML' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('yaml body');
  });

  it('expands accordion items', async () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>What is JSON Resume?</AccordionTrigger>
          <AccordionContent>An open standard.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const trigger = screen.getByRole('button', {
      name: 'What is JSON Resume?',
    });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('An open standard.')).toBeVisible();
  });

  it('shows tooltips on keyboard focus', async () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip content="Copy the link" delayDuration={0}>
          <Button>Share</Button>
        </Tooltip>
      </TooltipProvider>
    );
    await userEvent.tab();
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Copy the link'
    );
  });

  it('copies code and announces it', async () => {
    const user = userEvent.setup();
    render(<CodeBlock label="resume.json" code='{ "basics": {} }' />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(await navigator.clipboard.readText()).toBe('{ "basics": {} }');
    expect(screen.getByRole('button', { name: /Copied/ })).toBeInTheDocument();
  });

  it('marks the current page in breadcrumbs and nav lists', async () => {
    const { container } = render(
      <div>
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem current>Schema</BreadcrumbItem>
        </Breadcrumbs>
        <NavList label="Docs">
          <NavListItem href="/a" active>
            Getting started
          </NavListItem>
          <NavListItem href="/b">Schema</NavListItem>
        </NavList>
      </div>
    );
    expect(
      screen.getByText('Schema', { selector: '[aria-current="page"]' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Getting started' })
    ).toHaveAttribute('aria-current', 'page');
    expect(await axeViolations(container)).toEqual([]);
  });
});
