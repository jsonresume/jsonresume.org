'use client';

import { useId, useRef, useState, type ReactNode } from 'react';
import { visuallyHidden } from '../../styles/shared.css';
import { Button } from '../button/button';
import * as s from './inputs.css';

export interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  /** e.g. ".pdf,.json" or "application/pdf" */
  accept?: string;
  multiple?: boolean;
  /** Largest allowed file, in bytes. */
  maxSize?: number;
  title?: ReactNode;
  hint?: ReactNode;
  browseLabel?: string;
  disabled?: boolean;
}

const formatBytes = (n: number) =>
  n >= 1_048_576
    ? `${(n / 1_048_576).toFixed(1)} MB`
    : `${Math.max(1, Math.round(n / 1024))} KB`;

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  return accept.split(',').some((rule) => {
    const r = rule.trim().toLowerCase();
    if (r.startsWith('.')) return file.name.toLowerCase().endsWith(r);
    if (r.endsWith('/*')) return file.type.startsWith(r.slice(0, -1));
    return file.type === r;
  });
}

/**
 * Drag files in, or browse with a real button. Invalid files are rejected
 * with a reason that is announced.
 */
export function FileDropzone({
  onFiles,
  accept,
  multiple = false,
  maxSize,
  title = 'Drop a file here',
  hint,
  browseLabel = 'Choose file',
  disabled = false,
}: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const errorId = useId();

  const take = (list: FileList | null) => {
    const files = Array.from(list ?? []).slice(0, multiple ? undefined : 1);
    const wrongType = files.find((f) => !matchesAccept(f, accept));
    const tooBig = maxSize ? files.find((f) => f.size > maxSize) : undefined;
    if (wrongType)
      return setError(
        `${wrongType.name} isn't an accepted file type (${accept}).`
      );
    if (tooBig && maxSize)
      return setError(`${tooBig.name} is larger than ${formatBytes(maxSize)}.`);
    setError('');
    if (files.length) onFiles(files);
  };

  return (
    <div
      className={s.dropzone}
      data-dragging={dragging}
      data-invalid={Boolean(error)}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) take(e.dataTransfer.files);
      }}
    >
      <svg
        className={s.dropzoneIcon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          d="M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className={s.dropzoneTitle}>{title}</p>
      {hint ? <p className={s.dropzoneHint}>{hint}</p> : null}
      <Button
        size="sm"
        disabled={disabled}
        onClick={() => input.current?.click()}
        aria-describedby={error ? errorId : undefined}
      >
        {browseLabel}
      </Button>
      <input
        ref={input}
        type="file"
        className={visuallyHidden}
        tabIndex={-1}
        aria-hidden="true"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          take(e.target.files);
          e.target.value = '';
        }}
      />
      <p id={errorId} className={s.dropzoneHint} role="alert">
        {error}
      </p>
    </div>
  );
}

export interface FileListProps {
  files: File[];
  onRemove?: (file: File) => void;
}

/** The files chosen so far, with sizes and remove buttons. */
export function FileList({ files, onRemove }: FileListProps) {
  if (!files.length) return null;
  return (
    <ul className={s.fileList}>
      {files.map((f) => (
        <li key={`${f.name}-${f.size}`} className={s.fileItem}>
          <span className={s.fileName}>{f.name}</span>
          <span className={s.fileSize}>{formatBytes(f.size)}</span>
          {onRemove ? (
            <button
              type="button"
              className={s.iconButton}
              onClick={() => onRemove(f)}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  d="m4 4 8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <span className={visuallyHidden}>Remove {f.name}</span>
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
