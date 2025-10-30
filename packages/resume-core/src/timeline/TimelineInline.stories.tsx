import React from 'react';
import { TimelineInline } from './TimelineInline';

export default {
  title: 'Timeline/TimelineInline',
  component: TimelineInline,
  tags: ['autodocs'],
};

export const Default = {
  args: {
    startDate: '2020-01-15',
    endDate: '2022-03-30',
  },
};

export const OngoingPosition = {
  args: {
    startDate: '2022-03-01',
    endDate: null,
    presentLabel: 'Present',
  },
};

export const LongFormat = {
  args: {
    startDate: '2020-01-15',
    endDate: '2022-03-30',
    format: 'long',
  },
};

export const NumericFormat = {
  args: {
    startDate: '2020-01-15',
    endDate: '2022-03-30',
    format: 'numeric',
  },
};

export const FrenchLocale = {
  args: {
    startDate: '2020-01-15',
    endDate: null,
    locale: 'fr-FR',
    format: 'long',
  },
};

export const SpanishLocale = {
  args: {
    startDate: '2020-01-15',
    endDate: '2022-03-30',
    locale: 'es-ES',
    format: 'long',
  },
};

export const ArabicLocale = {
  args: {
    startDate: '2020-01-15',
    endDate: '2022-03-30',
    locale: 'ar-SA',
    numberingSystem: 'arab',
  },
};

export const JapaneseLocale = {
  args: {
    startDate: '2020-01-15',
    endDate: null,
    locale: 'ja-JP',
    format: 'long',
  },
};

export const WithHyphen = {
  args: {
    startDate: '2020-01-15',
    endDate: '2022-03-30',
    useEnDash: false,
  },
};
