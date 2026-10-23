'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx';
import { useFieldControl } from './field';
import * as s from './form.css';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, className, type = 'text', ...props },
  ref
) {
  const control = useFieldControl(props);
  return (
    <input
      ref={ref}
      type={type}
      className={cx(s.input({ size }), className)}
      {...control}
    />
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  const control = useFieldControl(props);
  return (
    <textarea ref={ref} className={cx(s.textarea, className)} {...control} />
  );
});

/** A styled native <select>: keyboard, mobile and screen-reader friendly by default. */
export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, ...props }, ref) {
  const control = useFieldControl(props);
  return <select ref={ref} className={cx(s.select, className)} {...control} />;
});

interface WithLabel {
  /** Visible label rendered beside the control. */
  label?: ReactNode;
}

export type CheckboxProps = ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> &
  WithLabel;

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox({ label, className, id, ...props }, ref) {
    const generated = useId();
    const controlId = id ?? generated;
    const root = (
      <CheckboxPrimitive.Root
        ref={ref}
        id={controlId}
        className={cx(s.checkbox, className)}
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          {props.checked === 'indeterminate' ? (
            <svg className={s.checkIcon} viewBox="0 0 12 12" aria-hidden="true">
              <path
                d="M2.5 6h7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg className={s.checkIcon} viewBox="0 0 12 12" aria-hidden="true">
              <path
                d="M2.5 6.25 5 8.75l4.5-5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
    if (!label) return root;
    return (
      <span className={s.inlineLabel}>
        {root}
        <label htmlFor={controlId}>{label}</label>
      </span>
    );
  }
);

export type SwitchProps = ComponentPropsWithoutRef<
  typeof SwitchPrimitive.Root
> &
  WithLabel;

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch({ label, className, id, ...props }, ref) {
    const generated = useId();
    const controlId = id ?? generated;
    const root = (
      <SwitchPrimitive.Root
        ref={ref}
        id={controlId}
        className={cx(s.switchRoot, className)}
        {...props}
      >
        <SwitchPrimitive.Thumb className={s.switchThumb} />
      </SwitchPrimitive.Root>
    );
    if (!label) return root;
    return (
      <span className={s.inlineLabel}>
        {root}
        <label htmlFor={controlId}>{label}</label>
      </span>
    );
  }
);
