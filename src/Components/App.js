import React, { useEffect } from 'react';
import '../App.css';
import signalingServer from '../js/signalingServer';

function App() {
  useEffect(() => {
    signalingServer.connectToWebsocket();
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <div id="container">

          <video id="localVideo" playsinline autoplay muted></video>
          <video id="remoteVideo" playsinline autoplay></video>

          <div className="box">
            <button id="startButton">Start</button>
            <button id="callButton">Call</button>
            <button id="hangupButton">Hang Up</button>
          </div>

        </div>
      </header>
    </div>
  );
}

export default App;
