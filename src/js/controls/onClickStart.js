import signalingServer from "../signaling/signalingServer";
import { dispatchAction } from "../storeManeger";
import { addAudioTrackID, addVideoTrackID } from "../../reducers/participants/participant-actions";
import webrtcController from "../webrtc/webrtcController";

export const onClickStart = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      window.localStreamObject = stream;
      console.log('Received local stream');
      signalingServer.connectToWebsocket();
      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];
      dispatchAction(addAudioTrackID({ id: audioTrack && audioTrack.id }));
      dispatchAction(addVideoTrackID({ id: videoTrack && videoTrack.id }));
      webrtcController.createPeerConnectionObject();
}

export const onClickHungUp = () => {
  webrtcController.peerConnectionObject.close();
  signalingServer.webSocket.close();
  webrtcController.peerConnectionObject = null;
  signalingServer.webSocket = null;
}