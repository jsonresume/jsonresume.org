// Masthead: identity, positioning, contact groups and optional portrait.

import { link, narrative } from './components.js';
import { formatLocation } from './location.js';
import {
  displayUrl,
  escapeHtml,
  isObject,
  mailtoHref,
  safeHref,
  telHref,
  text,
} from './text.js';

// Display names for common networks; anything else is shown as supplied.
const NETWORKS = {
  github: 'GitHub',
  gitlab: 'GitLab',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  x: 'X',
  mastodon: 'Mastodon',
  bluesky: 'Bluesky',
  stackoverflow: 'Stack Overflow',
  youtube: 'YouTube',
  orcid: 'ORCID',
  dribbble: 'Dribbble',
  behance: 'Behance',
  medium: 'Medium',
  instagram: 'Instagram',
  facebook: 'Facebook',
  kaggle: 'Kaggle',
  npm: 'npm',
};

const item = (html) => `<li>${html}</li>`;

/** Profile label: "GitHub: name" on screen, the address in print. */
function profileItem(profile) {
  const network = text(profile.network);
  const username = text(profile.username);
  const href = safeHref(profile.url);
  const networkName = network
    ? NETWORKS[network.toLowerCase()] || network
    : null;
  let label;
  if (networkName && username) label = `${networkName}: ${username}`;
  else if (username) label = username;
  else if (href) label = displayUrl(href);
  else return null;
  if (!href) return item(`<bdi>${escapeHtml(label)}</bdi>`);
  const printLabel = displayUrl(href);
  const inner =
    printLabel === label
      ? `<bdi>${escapeHtml(label)}</bdi>`
      : `<bdi class="pro-screen">${escapeHtml(
          label
        )}</bdi><bdi class="pro-print">${escapeHtml(printLabel)}</bdi>`;
  return item(`<a href="${escapeHtml(href)}">${inner}</a>`);
}

export function masthead(basics, ctx) {
  const b = isObject(basics) ? basics : {};
  const name = text(b.name);
  const label = text(b.label);

  const primary = [];
  const location = formatLocation(b.location, {
    full: ctx.settings.showFullAddress,
  });
  if (location) primary.push(item(escapeHtml(location)));
  const email = text(b.email);
  if (email) primary.push(item(`<bdi>${link(email, mailtoHref(email))}</bdi>`));
  const phone = text(b.phone);
  if (phone) primary.push(item(`<bdi>${link(phone, telHref(phone))}</bdi>`));

  const secondary = [];
  const site = safeHref(b.url);
  if (site) {
    secondary.push(
      item(
        `<a href="${escapeHtml(site)}"><bdi>${escapeHtml(
          displayUrl(site)
        )}</bdi></a>`
      )
    );
  } else if (text(b.url)) {
    secondary.push(item(`<bdi>${escapeHtml(text(b.url))}</bdi>`));
  }
  for (const p of Array.isArray(b.profiles) ? b.profiles : []) {
    if (isObject(p)) {
      const html = profileItem(p);
      if (html) secondary.push(html);
    }
  }

  const group = (items, aria) =>
    items.length
      ? `<ul class="pro-contacts" aria-label="${escapeHtml(aria)}">${items.join(
          ''
        )}</ul>`
      : '';

  const image = safeHref(b.image);
  const portrait =
    ctx.settings.showPortrait && image && image.startsWith('http')
      ? `<img class="pro-portrait" src="${escapeHtml(image)}" alt="${escapeHtml(
          name || ''
        )}">`
      : '';

  const heading = name
    ? `<h1 class="pro-name">${escapeHtml(name)}</h1>`
    : `<h1 class="pro-sr">${escapeHtml(ctx.labels.resume)}</h1>`;
  const identity = `${heading}${
    label ? `<p class="pro-label">${escapeHtml(label)}</p>` : ''
  }${group(primary, ctx.labels.contact)}${group(
    secondary,
    ctx.labels.profiles
  )}`;

  const hasVisible = name || label || primary.length || secondary.length;
  const head = hasVisible
    ? `<header class="pro-masthead${
        portrait ? ' pro-masthead--portrait' : ''
      }">${portrait}<div class="pro-identity">${identity}</div></header>`
    : `<header>${heading}</header>`;
  const summary = narrative(b.summary, 'pro-summary');
  return { html: head + summary, name };
}
