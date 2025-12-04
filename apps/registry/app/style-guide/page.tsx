'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { ScrollArea } from '@repo/ui';
import {
  ButtonSection,
  InputSection,
  CardSection,
  BadgeSection,
  CheckboxSection,
  SelectSection,
  TabsSection,
  ProgressSection,
  AccordionSection,
  AvatarSection,
  SeparatorSection,
  TimelineSection,
} from './sections';

export default function StyleGuidePage() {
  const [activeSection, setActiveSection] = useState('buttons');

  const sections = [
    { id: 'buttons', label: 'Buttons', component: ButtonSection },
    { id: 'inputs', label: 'Inputs & Forms', component: InputSection },
    { id: 'cards', label: 'Cards', component: CardSection },
    { id: 'badges', label: 'Badges', component: BadgeSection },
    { id: 'checkboxes', label: 'Checkboxes', component: CheckboxSection },
    { id: 'selects', label: 'Selects', component: SelectSection },
    { id: 'tabs', label: 'Tabs', component: TabsSection },
    { id: 'progress', label: 'Progress', component: ProgressSection },
    { id: 'accordions', label: 'Accordions', component: AccordionSection },
    { id: 'avatars', label: 'Avatars', component: AvatarSection },
    { id: 'separators', label: 'Separators', component: SeparatorSection },
    { id: 'timeline', label: 'Timeline', component: TimelineSection },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Style Guide</h1>
              <p className="text-gray-600 mt-1">
                Component library reference for JSON Resume Registry
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Package: <code className="text-blue-600">@repo/ui</code>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-3">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Components</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </nav>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {sections.map((section) => {
              const SectionComponent = section.component;
              return (
                <div
                  key={section.id}
                  className={activeSection === section.id ? 'block' : 'hidden'}
                >
                  <SectionComponent />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
