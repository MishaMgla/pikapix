import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { cert, getApps } from "firebase-admin/app";
import { getStorage, getDownloadURL } from "firebase-admin/storage";
import sharp from "sharp";

export const maxDuration = 200;
export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const fullImageUrl = json.url;
    const imageCount = json.count;
    const response = await fetch(fullImageUrl);
    const buffer = await response.arrayBuffer();

    const croppedBuffer = await sharp(buffer)
      .metadata()
      .then(({ width, height }) => {
        if (width && height) {
          return sharp(buffer)
            .extract({
              top: imageCount === 1 || imageCount === 2 ? 0 : height / 2,
              left: imageCount === 1 || imageCount === 4 ? 0 : width / 2,
              width: width / 2,
              height: height / 2,
            })
            .toBuffer();
        }
      });

    // TODO: funny 'smth went wrong' error page
    if (!croppedBuffer) return NextResponse.json({});

    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDS as string);

    const app = !getApps().length
      ? admin.initializeApp({
          credential: cert({
            projectId: serviceAccount.project_id,
            clientEmail: serviceAccount.client_email,
            privateKey: serviceAccount.private_key,
          }),
          storageBucket: "picapix-6565c.appspot.com",
        })
      : admin.app();

    const fileRef = getStorage(app)
      .bucket()
      .file(`${generateRandomString()}.jpg`);
    await fileRef.save(croppedBuffer);
    const url = await getDownloadURL(fileRef);

    return NextResponse.json({ imgUrl: url }, { status: 200 });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function generateRandomString(length = 20) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}
