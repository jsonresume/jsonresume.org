'use client';

import {
  createContext,
  type AriaAttributes,
  useContext,
  useId,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import * as s from './form.css';

interface FieldContextValue {
  controlId: string;
  describedBy: string | undefined;
  invalid: boolean;
  required: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/** Props a control should spread to join its Field (id, aria wiring). */
export function useFieldControl<
  P extends {
    id?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: AriaAttributes['aria-invalid'];
    required?: boolean;
  }
>(props: P): P {
  const field = useContext(FieldContext);
  if (!field) return props;
  return {
    ...props,
    id: props.id ?? field.controlId,
    'aria-describedby':
      [field.describedBy, props['aria-describedby']]
        .filter(Boolean)
        .join(' ') || undefined,
    'aria-invalid': props['aria-invalid'] ?? (field.invalid || undefined),
    required: props.required ?? (field.required || undefined),
  };
}

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  /** Help text shown under the label. */
  hint?: ReactNode;
  /** Error message; marks the control invalid. */
  error?: ReactNode;
  required?: boolean;
  /** Id for the control. Generated when omitted. */
  id?: string;
}

/**
 * Label, hint and error for one form control. The control inside (Input,
 * Textarea, Select) picks up its id and aria attributes automatically.
 */
export function Field({
  label,
  hint,
  error,
  required = false,
  id,
  className,
  children,
  ...props
}: FieldProps) {
  const generated = useId();
  const controlId = id ?? `${generated}-control`;
  const hintId = hint ? `${generated}-hint` : undefined;
  const errorId = error ? `${generated}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx(s.field, className)} {...props}>
      <label className={s.label} htmlFor={controlId}>
        {label}
        {required ? (
          <span className={s.required} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className={s.hint}>
          {hint}
        </p>
      ) : null}
      <FieldContext.Provider
        value={{ controlId, describedBy, invalid: Boolean(error), required }}
      >
        {children}
      </FieldContext.Provider>
      {error ? (
        <p id={errorId} className={s.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cx(s.label, className)} {...props} />;
}
