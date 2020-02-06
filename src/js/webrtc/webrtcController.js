import { getLocalUserId, dispatchAction, getParticipantIdByStreamId } from "../storeManeger";
import signalingServer from "../signaling/signalingServer";
import { ANSWER, OFFER, ICE_CANDIDATE } from "../constants";
import { setWebsocketConnected } from "../../reducers/room/room-actions";
import { trackAdded } from "../../reducers/participants/participant-actions";

class WebrtcController {
  constructor() {
    this.serverConfig = {
      iceServers: [
        { "urls": "stun:stun.l.google.com:19302" },
      ]
    };
    this.offerOptions = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    };
    this.peerConnectionObject = null;
  }
  createPeerConnectionObject() {
    console.log('Creating peer connection object');
    this.peerConnectionObject = new RTCPeerConnection();
    dispatchAction(setWebsocketConnected());
    this.peerConnectionObject.id = getLocalUserId();
    this.attachTracksToPeerConnectionObject();
    this.addEventListenersToWebrtcObject();
  }

  addEventListenersToWebrtcObject() {
    if (this.peerConnectionObject) {
      console.log('Adding webrtc event listeners');
      this.peerConnectionObject.addEventListener('icecandidate', this.onIceCandidate.bind(this));
      this.peerConnectionObject.addEventListener('iceconnectionstatechange', this.onIceStateChange.bind(this));
      this.peerConnectionObject.addEventListener('track', this.onRemoteTrack.bind(this));
    }
  }

  onIceCandidate(event) {
    console.log('Sending ice candidate to other peers')
    const { candidate } = event;
    if (candidate) {
      signalingServer.sendMessageViaSocket({ type: ICE_CANDIDATE, data: candidate })
    }
  }

  onIceStateChange(event) {
    if (this.peerConnectionObject) {
      console.log(`ICE state: ${this.peerConnectionObject.iceConnectionState}`);
      console.log('ICE state change event: ', event);
    }
  }

  onRemoteTrack(event) {
    console.log('Remote track is added')
    console.log(event);
    const { track, streams } = event;
    const participantId = getParticipantIdByStreamId(streams[0] && streams[0].id)
    dispatchAction(trackAdded({ id: participantId, track }))
  }

  attachTracksToPeerConnectionObject() {
    if (this.peerConnectionObject) {
      const localStreams = window.localStreamObject;
      if (localStreams) {
        console.log('Adding tracks to the webrtc object');
        localStreams.getTracks().forEach(track => this.peerConnectionObject.addTrack(track, localStreams));
      }
    }
  }

  /**
   * @returns : {type: offer, sdp}
   */
  async createOffer(toId) {
    if (this.peerConnectionObject) {
      try {
        console.log('Creating an offer ---')
        const offer = await this.peerConnectionObject.createOffer(this.offerOptions);
        this.setLocalDiscription(offer)
        signalingServer.sendMessageViaSocket({
          type: OFFER, data: {
            offer,
            toId,
            fromId: this.peerConnectionObject.id,
          }
        })
        return offer
      } catch (e) {
        console.error('Error happened while creating an offer');
        console.error(e);
      }
    }
  }

  async createAnswer(toId) {
    try {
      console.log('Creating an answer ---')
      const answer = await this.peerConnectionObject.createAnswer();
      this.setLocalDiscription(answer);
      signalingServer.sendMessageViaSocket({
        type: ANSWER, data: {
          answer,
          toId,
          fromId: this.peerConnectionObject.id,
        }
      })
      return answer;
    } catch (e) {
      console.error('Error happened while creating an answer');
      console.error(e);
    }
  }

  async setLocalDiscription(offer) {
    try {
      console.log('Setting local discription ---')
      await this.peerConnectionObject.setLocalDescription(offer);
    } catch (e) {
      console.error('Error happened while setting local discription');
      console.error(e);
    }
  }
  async setRemoteDiscription(answer) {
    try {
      console.log('Setting remote discription --- ACCEPTING ANSWER')
      await this.peerConnectionObject.setRemoteDescription(answer);
    } catch (e) {
      console.error('Error happened while setting remote discription');
      console.error(e);
    }
  }
  async setIceCandidate(candidate) {
    try {
      await (this.peerConnectionObject.addIceCandidate(candidate));
      console.log('Added Ice candidate successfully');
    } catch (e) {
      console.error('Error happened while setting ice candidate');
      console.error(e);
    }
  }
  getTrackById = (trackId) => {
    let track;
    const receivers = webrtcController.peerConnectionObject.getReceivers();
    receivers.forEach(peer => {
      if (peer.track.id === trackId) {
        track = peer.track;
      }
    });
    return track;
  }
}

const webrtcController = new WebrtcController();
window.webrtcController = webrtcController;

export default webrtcController;
