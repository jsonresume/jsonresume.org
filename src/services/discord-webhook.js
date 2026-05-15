/**
 * Discord Webhook Notification Service for JSON Resume
 */
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';

const EVENT_COLORS = {
  resume_created: 0x00ff00,
  resume_published: 0x5865F2,
  user_registered: 0xFFD700,
  theme_used: 0x9932CC,
};

async function sendDiscordNotification(event) {
  if (!DISCORD_WEBHOOK_URL) return false;
  
  const embed = {
    title: getTitle(event.type),
    description: getDescription(event),
    color: EVENT_COLORS[event.type] || 0x808080,
    timestamp: new Date().toISOString(),
    fields: getFields(event),
  };
  
  const response = await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'JSON Resume', embeds: [embed] }),
  });
  
  return response.ok;
}

function getTitle(type) {
  return {
    resume_created: '📝 New Resume Created',
    resume_published: '🚀 Resume Published',
    user_registered: '👤 New User Registered',
    theme_used: '🎨 Theme Used',
  }[type] || '📢 Platform Event';
}

function getDescription(event) {
  const d = event.data || {};
  return {
    resume_created: `New resume by **${d.userName || 'Unknown'}**`,
    resume_published: `Resume "**${d.resumeName || 'Untitled'}**" published`,
    user_registered: `Welcome **${d.userName || 'Unknown'}**!`,
    theme_used: `Theme **${d.themeName || 'Unknown'}** applied`,
  }[event.type] || 'Platform event';
}

function getFields(event) {
  const d = event.data || {};
  const fields = [];
  if (d.userName) fields.push({ name: 'User', value: d.userName, inline: true });
  if (d.resumeName) fields.push({ name: 'Resume', value: d.resumeName, inline: true });
  return fields;
}

module.exports = { sendDiscordNotification };
