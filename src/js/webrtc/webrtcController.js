import { getLocalUserId } from "../storeManeger";

class WebrtcController {
    constructor() {
        this.serverConfig = {
            iceServers: [
              {"urls": "stun:stun.l.google.com:19302"},
            ]
          };
        this.offerOptions = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
          };
        this.peerConnectionObject = null;
    }
    createPeerConnectionObject() {
      this.peerConnectionObject = new RTCPeerConnection(this.serverConfig); 
      this.peerConnectionObject.id = getLocalUserId(); 
      this.attachTracksToPeerConnectionObject();
    }
    

    attachTracksToPeerConnectionObject() {
      if(this.peerConnectionObject) {
        const localStreams = window.localStreamObject;
        if (localStreams) {
          localStreams.getTracks().forEach(track => this.peerConnectionObject.addTrack(track, localStreams));
        }
      }
    }
}

const webrtcController = new WebrtcController();
window.webrtcController = webrtcController.peerConnectionObject;

export default webrtcController;
