export const generateImage = async (text: string) => {
  try {
    const response = await fetch("/api/fetchImages2", {
      method: "POST",
      body: JSON.stringify({ text }),
    });

    console.log("generateImage text", text);

    const json = await response.json();
    const { imageUrl, error } = json;

    return {
      imageUrl,
      error,
    };
  } catch (error) {
    console.error(error);
    return {
      imageUrl: "",
      error: "No image generated. Internal error",
    };
  }
};
