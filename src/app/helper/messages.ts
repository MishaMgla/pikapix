export interface UIMessage {
  stopRecording: string;
  generating: string;
  startRecording: string;
  errorGeneratingImage: string;
  voiceButton: string;
  audioError: string;
}

export const UIMessageEn: UIMessage = {
  stopRecording: "Stop Recording",
  generating: "Generating",
  startRecording: "Start Recording",
  errorGeneratingImage: "Error generating image",
  voiceButton: "Voice button",
  audioError: "Error. Don't understand",
};

export const UIMessageRu: UIMessage = {
  stopRecording: "Остановить запись",
  generating: "Генерация",
  startRecording: "Говорить",
  errorGeneratingImage: "Ошибка при генерации изображения",
  voiceButton: "Голосовая кнопка",
  audioError: "Ошибка. Не понял вас",
};
