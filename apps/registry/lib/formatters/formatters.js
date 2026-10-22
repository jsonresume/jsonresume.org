import qr from './qr';
import template from './template';
import txt from './text';
import json from './json';
import yaml from './yaml';
import rendercv from './rendercv';
import agent from './agent';
import pdf from './pdf';

const formatters = {
  agent,
  qr,
  json,
  txt,
  template,
  html: template,
  yaml,
  rendercv,
  pdf,
};

export default formatters;
