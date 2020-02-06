import signalingServer from "../signaling/signalingServer";
import { dispatchAction, getItemFromStore } from "../storeManeger";
import { addAudioTrackID, addVideoTrackID, DISCONNECT_CALL, addMediaStreamId } from "../../reducers/participants/participant-actions";
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
      dispatchAction(addMediaStreamId({ id: stream.id }));
      webrtcController.createPeerConnectionObject();
}

export const onClickCall = async () => {
  const participantsObj = getItemFromStore('participants');
  const participants = Object.values(participantsObj);
  participants.forEach(async (participant) => {
    await webrtcController.createOffer(participant.id);
  });
};

export const onClickHungUp = () => {
  dispatchAction({ type: DISCONNECT_CALL });
  signalingServer.disconnectToWebsocket();
  webrtcController.peerConnectionObject.close();
  signalingServer.webSocket.close();
  webrtcController.peerConnectionObject = null;
  signalingServer.webSocket = null;
  const localTracks = window.localStreamObject.getTracks()
  localTracks.forEach(track => track.stop());
}