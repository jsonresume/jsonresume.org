require('dotenv').config({ path: __dirname + '/./../../.env' });
const axios = require('axios');

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const HN_API = 'https://hn.algolia.com/api/v1/items/';
const WHO_IS_HIRING_ITEM_ID = 42297424;

async function main() {
  const response = await axios.get(`${HN_API}${WHO_IS_HIRING_ITEM_ID}`);
  const { data } = response;

  const posts = data.children;

  posts.forEach(async (post) => {
    console.log({ post });
    try {
      const { error } = await supabase.from('jobs').insert({
        uuid: post.id,
        content: post.text,
        posted_at: new Date(post.created_at_i * 1000),
        type: 'hackernews',
        raw: JSON.stringify(post),
        url: `https://news.ycombinator.com/item?id=${post.id}`,
      });
      console.log({ error });
    } catch (e) {
      console.error(e);
    }
  });
}

main();
