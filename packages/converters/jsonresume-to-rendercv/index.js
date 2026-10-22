#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { convert } from './convert.js';

const [inputFile, outputFile = 'resume.yaml'] = process.argv.slice(2);

if (!inputFile) {
  console.error(
    'Usage: jsonresume-to-rendercv <resume.json> [output.yaml] (default: resume.yaml)'
  );
  process.exit(1);
}

const inputPath = path.resolve(inputFile);
const outputPath = path.resolve(process.cwd(), outputFile);

fs.readFile(inputPath, 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading input file:', err);
    process.exit(1);
  }

  let resumeData;
  try {
    resumeData = JSON.parse(data);
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
    process.exit(1);
  }

  const rendercvData = await convert(resumeData);

  fs.writeFile(outputPath, rendercvData, (writeErr) => {
    if (writeErr) {
      console.error('Error writing output file:', writeErr);
      process.exit(1);
    }

    console.log('Converted resume saved to:', outputPath);
  });
});
