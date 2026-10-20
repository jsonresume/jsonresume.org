// Social networks RenderCV accepts (rendercv/schema/models/cv/social_network.py).
// RenderCV rejects any other value, so unsupported profiles are dropped.
const RENDERCV_NETWORKS = [
  'LinkedIn',
  'GitHub',
  'GitLab',
  'IMDB',
  'Instagram',
  'ORCID',
  'Mastodon',
  'StackOverflow',
  'ResearchGate',
  'YouTube',
  'Google Scholar',
  'Telegram',
  'WhatsApp',
  'Leetcode',
  'X',
  'Bluesky',
  'Reddit',
];

// Former names of networks RenderCV knows under a new one.
const RENAMED = { twitter: 'X' };

const normalize = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

const byNormalizedName = new Map(
  RENDERCV_NETWORKS.map((network) => [normalize(network), network])
);

export const toRenderCVNetwork = (name) => {
  if (typeof name !== 'string') return undefined;
  const key = normalize(name);
  return byNormalizedName.get(key) ?? RENAMED[key];
};

export const toSocialNetworks = (profiles = []) =>
  profiles
    .map((profile) => ({
      network: toRenderCVNetwork(profile.network),
      username: profile.username,
    }))
    .filter((profile) => profile.network && profile.username);
