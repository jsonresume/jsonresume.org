import { execFile as execFileCallback } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execFile = promisify(execFileCallback);

describe('directory resume loading', () => {
  it('loads a real directory through the ESM-only quaff adapter', async () => {
    const loaderPath = path.join(__dirname, 'quaff-loader.js');
    const fixturePath = path.join(
      __dirname,
      '..',
      'test-fixtures',
      'quaff-resume',
    );
    const script = [
      `const load = require(${JSON.stringify(loaderPath)});`,
      'load(process.argv[1])',
      '  .then((resume) => console.log(JSON.stringify(resume)))',
      '  .catch((error) => { console.error(error); process.exitCode = 1; });',
    ].join('\n');

    const { stdout } = await execFile(
      process.execPath,
      ['-e', script, fixturePath],
      { cwd: __dirname },
    );

    expect(JSON.parse(stdout)).toEqual({
      basics: { email: 'thomas@example.com', name: 'thomas' },
      work: [{ company: 'Pied Piper', position: 'CEO/President' }],
    });
  });
});
