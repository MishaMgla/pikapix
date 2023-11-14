"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import loader from "../public/loader.svg";
import recording from "../public/recording.svg";
import { generateImage } from "./helper/imageGenerator";
import { ImageLoader } from "./components/ImageLoader";
import { useAudioRecorder } from "react-audio-voice-recorder";
import { UIMessage, UIMessageEn, UIMessageRu } from "./helper/messages";

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const base64data = reader.result?.toString().split(",")[1] || "";
      resolve(base64data);
    };
  });
};

const VoiceRecorder: React.FC = () => {
  const isFirstRender = useRef(true);
  const [waitingImage, setWaitingImage] = useState<boolean>(false);
  const [isAudioConverting, setIsAudioConverting] = useState<boolean>(false);
  const [userText, setUserText] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [loadingImages, setLoadingImages] = useState<boolean>(false);
  const [isFirstStop, setFirstStop] = useState(true);
  const [isProcessingAudio, setIsProcessingAudio] = useState<boolean>(false);
  // const [showCropAres, setShowCropAres] = useState(false);
  const [message, setMessage] = useState<UIMessage>(UIMessageEn);

  useEffect(() => {
    if (window.navigator.language === "ru") {
      setMessage(UIMessageRu);
    }
  }, []);

  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } = useAudioRecorder();

  const startRecordWrapper = () => {
    setImage("");
    setUserText("");

    startRecording();
  };

  useEffect(() => {
    if (recordingBlob) {
      (async () => {
        setFirstStop(false);
        try {
          // setShowCropAres(false);
          setIsProcessingAudio(true);
          const userAudio = await blobToBase64(recordingBlob);
          const audioText = await fetch("/api/convertAudioToEnglishText", {
            method: "POST",
            body: JSON.stringify({ userAudio }),
          });
          const json = await audioText.json();
          setUserText(json.data);
        } catch (err) {
          console.error("Failed to convert audio to text :", err);
          alert(message.audioError);
          setIsAudioConverting(false);
          setWaitingImage(false);
        }
        setIsProcessingAudio(false);
      })();
    }
  }, [recordingBlob]);

  useEffect(() => {
    (async () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      if (!userText) return;

      setLoadingImages(true);
      const imageResult = await generateImage(userText);
      setWaitingImage(false);
      setLoadingImages(false);
      setIsAudioConverting(false);

      if (imageResult.error) {
        alert(message.errorGeneratingImage);
      }

      if (imageResult.imageUrl) {
        setImage(imageResult.imageUrl);
      }
    })();
  }, [userText]);

  return (
    <main>
      {isRecording ? (
        <button
          onClick={stopRecording}
          className={`btn-stop${!isFirstStop ? " sticky-button" : ""}`}
        >
          {message.stopRecording} ({recordingTime})
        </button>
      ) : waitingImage ? (
        <button
          disabled
          className={`btn-generating${!isFirstStop ? " sticky-button" : ""}`}
        >
          {message.generating}
        </button>
      ) : (
        <button
          onClick={startRecordWrapper}
          className={`btn-start${!isFirstStop ? " sticky-button" : ""}`}
        >
          {message.startRecording}
        </button>
      )}

      {userText && !image && <div className="text-query">{userText}</div>}

      {(isRecording || isProcessingAudio) && (
        <Image
          priority
          src={recording}
          alt=""
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: " translate(-50%, -50%)",
            width: "100vw",
            height: "100vh",
            zIndex: 5,
          }}
        />
      )}

      {loadingImages && (
        <Image
          priority
          src={loader}
          alt="Voice button"
          style={{
            width: "100vw",
            height: "100vh",
            zIndex: 1000,
          }}
        />
      )}
      <ImageLoader
        opacity={loadingImages || isAudioConverting || isRecording ? 1 : 0}
      />

      {image && <img src={image} alt="img" className="generated-img" />}
    </main>
  );
};

export default VoiceRecorder;
