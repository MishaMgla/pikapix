import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
export const maxDuration = 200;

const SKIP = false;
export async function POST(request: NextRequest) {
  const json = await request.json();
  const prompt = json.text;
  if (!prompt) {
    return;
  }

  if (SKIP) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    return NextResponse.json(
      {
        imageUrl:
          "https://media.discordapp.net/attachments/1163074641888297053/1163266440183418931/dmowski.alex_Hello._47ee63f6-07e8-49f1-9b0e-1a5b5227063d.png?ex=653ef34b&is=652c7e4b&hm=0525cbde6fd9814471ee0b99106f5d57ba00b9a568742aa38d67028cb22e5753&=&width=1020&height=1020",
      },
      { status: 200 }
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    console.log("res", response);
    const imgUrl = response.data[0].url;
    console.log("imgUrl", imgUrl);
    if (!imgUrl) {
      return NextResponse.json(
        { imageUrl: "", error: "No image generated" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ imageUrl: imgUrl }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { imageUrl: "", error: "No image generated. Internal error" },
      { status: 200 }
    );
  }
}
