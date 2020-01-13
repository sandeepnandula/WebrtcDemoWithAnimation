import { getLocalUserId, dispatchAction } from "../storeManeger";
import signalingServer from "../signaling/signalingServer";
import { ANSWER, OFFER, ICE_CANDIDATE } from "../constants";
import { setWebsocketConnected } from "../../reducers/room/room-actions";
import { trackAdded } from "../../reducers/participants/participant-actions";
import peerConnections from "./peerConnections";

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
  }
  createPeerConnectionObject(participantId) {
    console.log('Creating peer connection object for participantId', participantId);
    const peerConnectionObject = new RTCPeerConnection();
    peerConnectionObject.id = participantId;
    if (!peerConnections.peerConnectionObjects) {
      peerConnections.peerConnectionObjects = new Map()
    }
    peerConnections.setPeerConnectionObject(participantId, peerConnectionObject)
    this.attachTracksToPeerConnectionObject(participantId);
    this.addEventListenersToWebrtcObject(peerConnectionObject);
    dispatchAction(setWebsocketConnected());
  }

  addEventListenersToWebrtcObject(peerConnectionObject) {
    if (peerConnectionObject) {
      console.log('Adding webrtc event listeners');
      peerConnectionObject.addEventListener('icecandidate', this.onIceCandidate.bind(this, peerConnectionObject));
      peerConnectionObject.addEventListener('iceconnectionstatechange', this.onIceStateChange.bind(this, peerConnectionObject));
      peerConnectionObject.addEventListener('track', this.onRemoteTrack.bind(this, peerConnectionObject));
    }
  }

  onIceCandidate(peerConnectionObject, event) {
    console.log('Sending ice candidate to other peers')
    const { candidate } = event;
    if (candidate) {
      signalingServer.sendMessageViaSocket({
        type: ICE_CANDIDATE,
        data: candidate,
        toId: peerConnectionObject.id,
        fromId: getLocalUserId(),
      })
    }
  }

  onIceStateChange(peerConnectionObject, event) {
    if (peerConnectionObject) {
      console.log(`ICE state: ${peerConnectionObject.iceConnectionState}`);
      console.log('ICE state change event: ', event);
    }
  }

  onRemoteTrack(peerConnectionObject, event) {
    console.log('Remote track is added')
    const { track } = event;
    dispatchAction(trackAdded({ id: peerConnectionObject.id, track }))
  }

  attachTracksToPeerConnectionObject(participantId) {
    const peerConnectionObject = peerConnections.getPeerconnectionObject(participantId)
    if (peerConnectionObject) {
      const localStreams = window.localStreamObject;
      if (localStreams) {
        console.log('Adding tracks to the webrtc object');
        localStreams.getTracks().forEach(track => peerConnectionObject.addTrack(track, localStreams));
      }
    }
  }

  /**
   * @returns : {type: offer, sdp}
   */
  async createOffer(toId) {
    const peerConnectionObject = peerConnections.getPeerconnectionObject(toId)
    if (peerConnectionObject) {
      try {
        console.log("Creating offer for --- ", toId)
        const offer = await peerConnectionObject.createOffer(this.offerOptions);
        this.setLocalDiscription(offer, peerConnectionObject)
        signalingServer.sendMessageViaSocket({
          type: OFFER, data: {
            offer,
            toId,
            fromId: getLocalUserId(),
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
    const peerConnectionObject = peerConnections.getPeerconnectionObject(toId)
    try {
      console.log('Creating an answer --- ', toId)
      const answer = await peerConnectionObject.createAnswer();
      this.setLocalDiscription(answer, peerConnectionObject);
      signalingServer.sendMessageViaSocket({
        type: ANSWER, data: {
          answer,
          toId,
          fromId: getLocalUserId(),
        }
      })
      return answer;
    } catch (e) {
      console.error('Error happened while creating an answer');
      console.error(e);
    }
  }

  async setLocalDiscription(offer, peerConnectionObject) {
    try {
      console.log('Setting local discription --- ', peerConnectionObject.id)
      await peerConnectionObject.setLocalDescription(offer);
    } catch (e) {
      console.error('Error happened while setting local discription');
      console.error(e);
    }
  }
  async setRemoteDiscription(answer, peerConnectionObject) {
    try {
      console.log('Setting remote discription --- ACCEPTING ANSWER ---', peerConnectionObject.id)
      await peerConnectionObject.setRemoteDescription(answer);
    } catch (e) {
      console.error('Error happened while setting remote discription');
      console.error(e);
    }
  }
  async setIceCandidate(candidate, peerConnectionObject) {
    if (peerConnectionObject) {
      try {
        await (peerConnectionObject.addIceCandidate(candidate));
        console.log('Added Ice candidate successfully for ---', peerConnectionObject.id);
      } catch (e) {
        console.error('Error happened while setting ice candidate');
        console.error(e);
      }
    }
  }
  getTrackById = (trackId, participantId) => {
    let track;
    const peerConnectionObject = peerConnections.getPeerconnectionObject(participantId)
    if (peerConnectionObject) {
      const receivers = peerConnectionObject.getReceivers();
      receivers.forEach(peer => {
        if (peer.track.id === trackId) {
          track = peer.track;
        }
      });
      return track;
    }
    return null;
  }
}

const webrtcController = new WebrtcController();
window.webrtcController = webrtcController;

export default webrtcController;
