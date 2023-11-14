interface ImageLoaderProps {
  opacity: number;
}
export const ImageLoader = ({ opacity }: ImageLoaderProps) => {
  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          backgroundColor: "#225588",
          position: "fixed",
          left: "0",
          right: "0",
          top: "0",
          bottom: "0",
          margin: "auto",
          overflow: "hidden",
          opacity: opacity,
          transition: "opacity 10s ease-in-out",
        }}
      >
        <div className="art-container">
          <div className="art art-1"></div>
          <div className="art art-2"></div>
          <div className="art art-3"></div>
          <div className="art art-4"></div>
          <div className="art art-5"></div>
          <div className="art art-6"></div>
          <div className="art art-7"></div>
          <div className="art art-8"></div>
          <div className="art art-9"></div>
          <div className="art art-10"></div>
        </div>
      </div>
      <div
        className="art-container-noise"
        style={{
          opacity: opacity,
        }}
      ></div>
    </>
  );
};
