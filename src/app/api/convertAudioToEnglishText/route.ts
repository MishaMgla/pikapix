import OpenAI, { toFile } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { getBufferFromUrl } from "../file";
import { getConvertedUrl, sendRequestForConversion } from "../converter";

export const maxDuration = 200;
export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  try {
    const startTime = Date.now();
    console.log("start openai");

    const audioData = await request.json();
    const userRecord = audioData.userAudio; // base64 string

    const idConverting = await sendRequestForConversion(userRecord);
    let audioUrl = await getConvertedUrl(idConverting);
    let iterator = 0;

    while (!audioUrl && iterator < 20) {
      iterator++;
      await new Promise((resolve) => setTimeout(resolve, 300));
      const tempAudioUrl = await getConvertedUrl(idConverting);
      audioUrl = tempAudioUrl || "";
    }
    console.log("AUDIO URL", audioUrl);
    const endTime = Date.now();

    console.log("Time for conversion", endTime - startTime);

    if (!audioUrl) {
      return NextResponse.json({ error: "No url" }, { status: 200 });
    }
    const outputBuffer = await getBufferFromUrl(audioUrl);
    if (!outputBuffer) {
      return NextResponse.json({ error: "No buffer" }, { status: 200 });
    }

    console.log("save file done");
    const file = await toFile(outputBuffer, "audio.mp3");
    console.log("File from path");
    const response = await openai.audio.translations.create({
      file: file,
      model: "whisper-1",
    });

    const text = response.text;

    console.log("text", text);

    return NextResponse.json({ data: text }, { status: 200 });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
