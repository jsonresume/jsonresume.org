import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  ChatComposer,
  Combobox,
  Field,
  FileDropzone,
  FilterBar,
  Input,
  RangeSlider,
  Repeater,
  SearchField,
  SegmentedControl,
  Select,
  TagInput,
} from '../index';
import { axeViolations } from '../test/axe';

describe('SearchField', () => {
  it('debounces search, clears with the button and Escape', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onSearch = vi.fn();
    render(
      <Field label="Search jobs">
        <SearchField onSearch={onSearch} debounceMs={200} />
      </Field>
    );
    const input = screen.getByRole('searchbox', { name: 'Search jobs' });
    await userEvent.type(input, 'rust');
    expect(onSearch).not.toHaveBeenCalledWith('rust');
    act(() => vi.advanceTimersByTime(250));
    expect(onSearch).toHaveBeenLastCalledWith('rust');
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(input).toHaveValue('');
    expect(onSearch).toHaveBeenLastCalledWith('');
    await userEvent.type(input, 'go{Escape}');
    expect(input).toHaveValue('');
    vi.useRealTimers();
  });
});

describe('FilterBar', () => {
  it('lists active filters with remove buttons and Clear all', async () => {
    const remove = vi.fn();
    const clear = vi.fn();
    const { container } = render(
      <FilterBar
        active={[{ key: 'remote', label: 'Remote', onRemove: remove }]}
        onClearAll={clear}
        resultCount={12}
      >
        <Field label="Type">
          <Select>
            <option>Any</option>
          </Select>
        </Field>
      </FilterBar>
    );
    expect(screen.getByRole('region', { name: 'Filters' })).toHaveTextContent(
      '12 results'
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove Remote' })
    );
    expect(remove).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(clear).toHaveBeenCalledOnce();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('SegmentedControl', () => {
  it('is a labelled radio group', async () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        label="Editor mode"
        options={[
          { value: 'form', label: 'Form' },
          { value: 'json', label: 'JSON' },
        ]}
        onValueChange={onValueChange}
      />
    );
    // Arrow-key movement is Radix's roving focus (tested upstream); jsdom
    // can't drive it, so select by pointer and check the semantics.
    expect(
      screen.getByRole('radiogroup', { name: 'Editor mode' })
    ).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Form' })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: 'JSON' }));
    expect(onValueChange).toHaveBeenCalledWith('json');
    expect(screen.getByRole('radio', { name: 'JSON' })).toBeChecked();
  });
});

describe('TagInput', () => {
  it('adds with Enter and comma, removes with Backspace and buttons, splits pasted lists', async () => {
    function Harness() {
      const [tags, setTags] = useState(['React']);
      return (
        <Field label="Skills">
          <TagInput value={tags} onValueChange={setTags} />
        </Field>
      );
    }
    render(<Harness />);
    const input = screen.getByRole('textbox', { name: 'Skills' });
    await userEvent.type(input, 'Go{Enter}Rust,');
    expect(screen.getByText('Go')).toBeInTheDocument();
    expect(screen.getByText('Rust')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Remove React' }));
    expect(screen.queryByText('React')).not.toBeInTheDocument();
    await userEvent.type(input, '{Backspace}');
    expect(screen.queryByText('Rust')).not.toBeInTheDocument();
    await userEvent.click(input);
    await userEvent.paste('SQL, Kafka, Go');
    expect(screen.getByText('SQL')).toBeInTheDocument();
    expect(screen.getByText('Kafka')).toBeInTheDocument();
    expect(screen.getAllByText('Go')).toHaveLength(1);
  });
});

describe('RangeSlider', () => {
  it('names both thumbs and reports formatted values', () => {
    const { container } = render(
      <RangeSlider
        label="Salary"
        min={0}
        max={300}
        defaultValue={[100, 200]}
        formatValue={(v) => `$${v}k`}
        distribution={[1, 4, 8, 3]}
      />
    );
    const thumbs = screen.getAllByRole('slider');
    expect(thumbs[0]).toHaveAccessibleName('Minimum');
    expect(thumbs[1]).toHaveAttribute('aria-valuetext', '$200k');
    expect(screen.getByText('$100k – $200k')).toBeInTheDocument();
    return axeViolations(container).then((v) => expect(v).toEqual([]));
  });
});

describe('Combobox', () => {
  it('filters, moves with arrows via aria-activedescendant, and picks with Enter', async () => {
    const onValueChange = vi.fn();
    render(
      <Field label="Country">
        <Combobox
          options={[
            { value: 'au', label: 'Australia' },
            { value: 'at', label: 'Austria' },
            { value: 'nz', label: 'New Zealand' },
          ]}
          onValueChange={onValueChange}
        />
      </Field>
    );
    const input = screen.getByRole('combobox', { name: 'Country' });
    await userEvent.type(input, 'aus');
    expect(screen.getAllByRole('option')).toHaveLength(2);
    await userEvent.keyboard('{ArrowDown}');
    expect(input.getAttribute('aria-activedescendant')).toBe(
      screen.getAllByRole('option')[1]?.id
    );
    await userEvent.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('at');
    expect(input).toHaveValue('Austria');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('FileDropzone', () => {
  it('rejects the wrong type with an announced reason and accepts valid files', () => {
    const onFiles = vi.fn();
    render(<FileDropzone onFiles={onFiles} accept=".pdf" maxSize={1024} />);
    const zone = screen.getByRole('button', { name: 'Choose file' })
      .parentElement as HTMLElement;
    fireEvent.drop(zone, {
      dataTransfer: { files: [new File(['x'], 'resume.docx')] },
    });
    expect(screen.getByRole('alert')).toHaveTextContent(
      "resume.docx isn't an accepted file type"
    );
    fireEvent.drop(zone, {
      dataTransfer: {
        files: [new File(['x'], 'resume.pdf', { type: 'application/pdf' })],
      },
    });
    expect(onFiles).toHaveBeenCalledOnce();
    expect(screen.getByRole('alert')).toHaveTextContent('');
  });
});

describe('Repeater', () => {
  it('adds, reorders and removes entries with labelled controls and announcements', async () => {
    function Harness() {
      const [jobs, setJobs] = useState([
        { title: 'Engineer' },
        { title: 'Lead' },
      ]);
      return (
        <Repeater
          items={jobs}
          onChange={setJobs}
          create={() => ({ title: '' })}
          itemLabel={(j) => j.title || 'Untitled position'}
          noun="position"
          addLabel="Add position"
          renderItem={(job, update) => (
            <Field label="Title">
              <Input
                value={job.title}
                onChange={(e) => update({ title: e.target.value })}
              />
            </Field>
          )}
        />
      );
    }
    const { container } = render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Move Lead up' }));
    expect(screen.getAllByRole('heading').map((h) => h.textContent)).toEqual([
      'Lead',
      'Engineer',
    ]);
    expect(
      screen.getByText('Moved Lead to position 1 of 2.')
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Add position' }));
    expect(
      screen.getByRole('region', { name: 'Untitled position' })
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove Engineer' })
    );
    expect(
      screen.queryByRole('region', { name: 'Engineer' })
    ).not.toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('ChatComposer', () => {
  it('sends on Enter, adds a line on Shift+Enter, and blocks while busy', async () => {
    const onSubmit = vi.fn();
    const { rerender } = render(<ChatComposer onSubmit={onSubmit} />);
    const box = screen.getByRole('textbox', { name: 'Message' });
    await userEvent.type(box, 'Hello{Shift>}{Enter}{/Shift}there');
    expect(box).toHaveValue('Hello\nthere');
    await userEvent.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('Hello\nthere');
    expect(box).toHaveValue('');
    rerender(<ChatComposer onSubmit={onSubmit} busy />);
    await userEvent.type(box, 'Again{Enter}');
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
