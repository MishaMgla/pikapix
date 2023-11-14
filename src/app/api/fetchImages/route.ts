import { Midjourney } from "midjourney";
import { NextRequest, NextResponse } from "next/server";
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

  try {
    const client = new Midjourney({
      ServerId: process.env.DISCORD_SERVER_ID,
      ChannelId: process.env.DISCORD_CHANNEL_ID,
      SalaiToken: process.env.DISCORD_TOKEN || "",
      Debug: true,
      Ws: true, //enable ws is required for remix mode (and custom zoom)
    });

    console.log("start mj");

    await client.init();
    const Imagine = await client.Imagine(prompt, (uri: string, progress: string) => {
      console.log("loading", uri);
      console.log("progress", progress);
      console.log("-----------------------");
    });

    console.log("-----Imagine\n", Imagine);
    if (!Imagine) {
      console.log("!!!!ERROR--!Imagine\n", Imagine);
      console.log("no message");
      return NextResponse.json({ imageUrl: "", error: "No image generated" }, { status: 200 });
    }

    return NextResponse.json({ imageUrl: Imagine.uri, error: "" }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { imageUrl: "", error: "No image generated. Internal error" },
      { status: 200 }
    );
  }
}
