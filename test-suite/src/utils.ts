import { BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js';
import { readFileSync } from 'fs';

export async function zipResource(path: string): Promise<ArrayBuffer> {
  const files = new Map<string, string>();
  files.set(path, 'ro-crate-metadata.json');
  return zipResources(files);
}

export async function zipResources(
  files: Map<string, string>
): Promise<ArrayBuffer> {
  try {
    const zipWriter = new ZipWriter(new BlobWriter());

    for (const [path, entryName] of files) {
      const fileContent = readFileSync(path, 'utf-8');
      await zipWriter.add(entryName, new TextReader(fileContent));
    }

    const zipBlob = await zipWriter.close();
    return zipBlob.arrayBuffer();
  } catch (error) {
    console.error('Error generating zip file:', error);
    throw error;
  }
}
