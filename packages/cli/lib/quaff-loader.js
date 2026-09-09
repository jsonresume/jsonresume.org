// The CLI is compiled to CommonJS, while quaff 5 is ESM-only. Keeping the
// native import behind the Function constructor prevents Babel from rewriting
// it to require(), which would fail on Node 18 and 20.
const nativeImport = new Function('specifier', 'return import(specifier)');

let quaffPromise;

const loadDirectory = async (directory) => {
  quaffPromise ||= nativeImport('quaff');
  const { load } = await quaffPromise;
  return load(directory);
};

module.exports = loadDirectory;
