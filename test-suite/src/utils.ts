import { BlobWriter, TextReader, ZipWriter } from "@zip.js/zip.js";
import { readFileSync } from "fs";
import { API_KEY, BASE_URL } from "./env";

export async function pollJob(jobId: string) {
  let res, body;
  do {
    res = await fetch(`${BASE_URL}/status/${jobId}`, {
      method: "GET",
      headers: {
        "api-key": API_KEY,
      },
    });
    const clonedResponse = await res.clone();
    body = await clonedResponse.json();
    console.log(`Polling job ${jobId}: ${body.status}`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } while (["SCHEDULED", "RUNNING"].includes(body.status));

  console.log(
    `Job ${jobId} finished with following result:\n${JSON.stringify(body, null, 2)}`,
  );

  return res;
}

export async function zipResource(path: string): Promise<ArrayBuffer> {
  const files = new Map<string, string>();
  files.set(path, "ro-crate-metadata.json");
  return zipResources(files);
}

export async function zipResources(
  files: Map<string, string>,
): Promise<ArrayBuffer> {
  try {
    const zipWriter = new ZipWriter(new BlobWriter());

    for (const [path, entryName] of files) {
      const fileContent = readFileSync(path, "utf-8");
      await zipWriter.add(entryName, new TextReader(fileContent));
    }

    const zipBlob = await zipWriter.close();
    return zipBlob.arrayBuffer();
  } catch (error) {
    console.error("Error generating zip file:", error);
    throw error;
  }
}
