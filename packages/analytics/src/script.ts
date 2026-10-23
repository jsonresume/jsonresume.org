/**
 * The script added to every themed resume page. It reports the view when
 * the page opens, then how long it was visible and how far down it was
 * read: when hidden or closed, and every 30 seconds while visible. No
 * cookies, no storage, nothing about the reader beyond what the request
 * itself carries. Kept tiny and dependency-free; failures are silent.
 */
/** JSON that can't close the script tag it sits in. */
const literal = (value: string | null) =>
  JSON.stringify(value).replace(/</g, '\\u003c');

const source = (username: string, theme: string | null) => `(function(){try{
var u=${literal(username)},t=${literal(theme)};
var c=window.crypto,v=c&&c.randomUUID?c.randomUUID():null;if(!v)return;
var shown=0,since=document.visibilityState==="visible"?Date.now():0,depth=0;
function measure(){var h=document.documentElement,b=document.body,
s=Math.max(h.scrollHeight,b?b.scrollHeight:0,1);
depth=Math.max(depth,Math.min(100,Math.round((window.scrollY+window.innerHeight)/s*100)))}
function send(p,d){var j=JSON.stringify(d);
if(navigator.sendBeacon&&navigator.sendBeacon(p,new Blob([j],{type:"application/json"})))return;
fetch(p,{method:"POST",body:j,headers:{"content-type":"application/json"},keepalive:true}).catch(function(){})}
function seconds(){return Math.min(86400,Math.round((shown+(since?Date.now()-since:0))/1000))}
function ping(){send("/api/events/ping",{viewId:v,seconds:seconds(),depth:depth})}
measure();addEventListener("scroll",measure,{passive:true});
send("/api/events/view",{viewId:v,username:u,theme:t,referrer:document.referrer||null,width:window.innerWidth});
document.addEventListener("visibilitychange",function(){
if(document.visibilityState==="hidden"){if(since){shown+=Date.now()-since;since=0}ping()}else{since=Date.now()}});
addEventListener("pagehide",ping);
setInterval(function(){if(since)ping()},30000);
}catch(e){}})();`;

/** A themed page with the view script added just before </body>. */
export function withTracking(
  html: string,
  username: string,
  theme: string | null
): string {
  const script = `<script>${source(username, theme).replace(
    /\n/g,
    ''
  )}</script>`;
  const end = html.toLowerCase().lastIndexOf('</body>');
  return end === -1
    ? html + script
    : html.slice(0, end) + script + html.slice(end);
}
