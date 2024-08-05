import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

const ImageCapture = ({ onImageCaptured }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    onImageCaptured(imageSrc);
  };

  return (
    <div className="image-capture-container">
      {isCameraOpen ? (
        <div className="webcam-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
          />
          <button onClick={captureImage}>Capture</button>
          <button className="clear-btn" onClick={() => setImage(null)}>
            Clear Image
          </button>
          {image && (
            <img src={image} alt="Captured" className="captured-image" />
          )}
          <button className="close-btn" onClick={() => setIsCameraOpen(false)}>
            Close Camera
          </button>
        </div>
      ) : (
        <button onClick={() => setIsCameraOpen(true)}>Open Camera</button>
      )}
    </div>
  );
};

export default ImageCapture;
