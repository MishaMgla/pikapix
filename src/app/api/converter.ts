const CONVERTIO_API_KEY = process.env.CONVERTIO_API_KEY;

export const sendRequestForConversion = async (base64: string) => {
  const data = {
    apikey: CONVERTIO_API_KEY,
    input: "base64",
    file: base64,
    outputformat: "mp3",
    filename: "test.mp3",
  };
  const convertRequest = await fetch("https://api.convertio.co/convert", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const convertResponse = await convertRequest.json();
  return convertResponse?.data?.id as string;
};

export const getConvertedUrl = async (id: string): Promise<string | null> => {
  const statusRequest = await fetch(`https://api.convertio.co/convert/${id}/status`);
  const responseData = await statusRequest.json();
  const percent = responseData?.data?.["step_percent"] || 0;

  if (percent !== 100) {
    return null;
  }

  console.log("getConvertedUrl", responseData);

  const url = responseData?.data?.output?.url || null;
  return url as string | null;
};
