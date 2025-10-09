'use client';

import { Plus, Trash2 } from 'lucide-react';
import {
  Button,
  Input,
  Textarea,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@repo/ui';

export const FormSection = ({ title, children, defaultOpen = false }) => {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? 'item-1' : undefined}
      className="mb-4"
    >
      <AccordionItem value="item-1" className="border rounded-lg">
        <AccordionTrigger className="px-4 py-3 bg-gray-50 rounded-t-lg hover:bg-gray-100">
          <h3 className="font-medium text-gray-900">{title}</h3>
        </AccordionTrigger>
        <AccordionContent className="p-4 space-y-4">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {type === 'textarea' ? (
      <Textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
    ) : (
      <Input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    )}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export const ArrayField = ({
  items,
  onAdd,
  onRemove,
  renderItem,
  addLabel,
}) => (
  <div className="space-y-4">
    {items.map((item, index) => (
      <div key={index} className="relative border rounded-lg p-4">
        <Button
          variant="outline"
          size="sm"
          className="absolute top-2 right-2"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        {renderItem(item, index)}
      </div>
    ))}
    <Button
      variant="outline"
      size="sm"
      onClick={onAdd}
      className="w-full flex items-center justify-center gap-2"
    >
      <Plus className="w-4 h-4" />
      {addLabel}
    </Button>
  </div>
);
