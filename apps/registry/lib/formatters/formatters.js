import qr from './qr';
import template from './template';
import txt from './text';
import tex from './tex';
import json from './json';
import yaml from './yaml';
import rendercv from './rendercv';
import agent from './agent';

const formatters = {
  agent,
  qr,
  json,
  tex,
  txt,
  template,
  yaml,
  rendercv,
};

export default formatters;
