import React, { useRef, useState } from 'react';import './App.css';
import Webcam from 'react-webcam';


function App() {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [closestPok, setClosestPok] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  };

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  const sendToServer = async () => {
    if (imageSrc) {
      const file = dataURLtoFile(imageSrc, 'captured_image.jpg');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      console.log(result);
      setClosestPok(result);
    }
  };


  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: { ideal: "environment" } // Use "environment" for rear camera
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture</button>
      {imageSrc && (
        <>
          <img src={imageSrc} alt="Captured" />
          <button onClick={sendToServer}>Send to Server</button>
        </>
      )}
      {closestPok && <p>{closestPok['closest_pokemon']} </p>}
      {!closestPok && <p>Loading</p>}
    </div>
  );
}

export default App;
