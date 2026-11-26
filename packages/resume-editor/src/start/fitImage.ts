/** The long side a resume photo is scaled to: plenty for reading its text. */
const LONG_SIDE = 2400;

/**
 * A phone photo of a resume is often over the 5 MB import limit (a 48 MP
 * camera writes 5-10 MB). Rather than refuse it, an image over `max` is
 * redrawn as a JPEG no wider or taller than LONG_SIDE. Anything else, or a
 * browser that can't decode it (HEIC outside Safari), is returned as is,
 * for the size check to refuse.
 */
export async function fitImage(file: File, max: number): Promise<File> {
  if (
    file.size <= max ||
    !file.type.startsWith('image/') ||
    typeof createImageBitmap !== 'function'
  )
    return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      LONG_SIDE / Math.max(bitmap.width, bitmap.height)
    );
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas
      .getContext('2d')
      ?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((done) =>
      canvas.toBlob(done, 'image/jpeg', 0.85)
    );
    if (!blob || blob.size > max) return file;
    return new File([blob], `${file.name.replace(/\.[^.]*$/, '')}.jpg`, {
      type: 'image/jpeg',
    });
  } catch {
    return file;
  }
}

/** A file's extension for counting (pdf, heic): never its name. */
export const extensionOf = (file: File) => {
  const match = /\.([a-z0-9]{1,8})$/i.exec(file.name);
  return match?.[1]?.toLowerCase() ?? 'none';
};
