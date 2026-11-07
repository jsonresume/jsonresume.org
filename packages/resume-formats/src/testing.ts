/** For tests: reading back the files this package writes. */
import { inflateRawSync } from 'node:zlib';

/** The files in a zip, by name: enough of the format to read a .docx. */
export const unzip = (zip: Uint8Array): Map<string, string> => {
  const view = Buffer.from(zip.buffer, zip.byteOffset, zip.byteLength);
  const end = view.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  const count = view.readUInt16LE(end + 10);
  let at = view.readUInt32LE(end + 16);
  const files = new Map<string, string>();
  for (let i = 0; i < count; i++) {
    const method = view.readUInt16LE(at + 10);
    const size = view.readUInt32LE(at + 20);
    const nameLength = view.readUInt16LE(at + 28);
    const skip = nameLength + view.readUInt16LE(at + 30);
    const local = view.readUInt32LE(at + 42);
    const name = view.toString('utf8', at + 46, at + 46 + nameLength);
    at += 46 + skip + view.readUInt16LE(at + 32);
    const start =
      local +
      30 +
      view.readUInt16LE(local + 26) +
      view.readUInt16LE(local + 28);
    const data = view.subarray(start, start + size);
    files.set(
      name,
      (method === 8 ? inflateRawSync(data) : data).toString('utf8')
    );
  }
  return files;
};
