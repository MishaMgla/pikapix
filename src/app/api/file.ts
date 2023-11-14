import path from "path";
import fs from "fs";
import { pipeline } from "node:stream/promises";

export function ensureDirectoryExistence(filePath: string) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

const toBool = [() => true, () => false];

export async function readFile(filePath: string): Promise<string | null> {
  const exists = await fs.promises.access(filePath).then(...toBool);
  if (!exists) {
    console.log("no file", filePath);

    return null;
  }
  try {
    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    return fileContent || null;
  } catch (e) {
    console.log("Failed to read file", filePath);
    return null;
  }
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  ensureDirectoryExistence(filePath);
  await fs.promises.writeFile(filePath, content);
}

export const saveFile = async (fileUrl: string, filePath: string) => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const fileStream = fs.createWriteStream(filePath);

    if (!response.body) {
      throw new Error("No audio data");
    }

    await pipeline(response.body as any, fileStream);

    console.log(" file downloaded and saved.");
  } catch (error) {
    console.error("Error saving file file:", error);
  }
};

export const getBufferFromUrl = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const nodeBuffer = Buffer.from(buffer);

    return nodeBuffer;
  } catch (error) {
    console.error("Error fetching or converting to base64:", error);
    return null; // or you can re-throw the error depending on your error handling logic
  }
};
