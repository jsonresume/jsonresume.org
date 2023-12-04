export default function (str) {
  str = str.replace(/\//g, '/ ');
  return str.replace('/ / ', '//');
}
