import { SIGNALING_URL, PARTICIPANT_CONNECTED, PARTICIPANT_DISCONNECTED, PARTICIPANT_INFO, OFFER, ANSWER, ICE_CANDIDATE, UPDATE_PARTICIPANT_DETAILS } from "../constants";
// import { socketAccessToken } from "../../config";
import { getRoomName } from "../utils/utils";
import { getItemFromStore, dispatchAction } from "../storeManeger";
import { addParticipant, removeParticipant } from "../../reducers/participants/participant-actions";
import webrtcController from "../webrtc/webrtcController";
import { setWebsocketConnected, setWebsocketDisconnected } from "../../reducers/room/room-actions";
import peerConnections from "../webrtc/peerConnections";

class SignalingServer {
    constructor() {
        this.channelId = getRoomName();
        this.socketUrl = `${SIGNALING_URL}/${this.channelId}?token=${''}`;
        this.webSocket = null;
    }

    connectToWebsocket()  {
        this.webSocket = new WebSocket(this.socketUrl);
        this.addEventListeners();
    }

    disconnectToWebsocket() {
        const clossingMessage = { type: PARTICIPANT_DISCONNECTED, data: {
            participantDetails: getItemFromStore('localParticipant'),
        }}
        this.sendMessageViaSocket(clossingMessage);
        this.webSocket.close()
    }

    socketOnOpeon(e) {
        console.log(e);
        console.log('Websocket is connected')
        this.sendParticipantDetails();
        dispatchAction(setWebsocketConnected());
        window.addEventListener('beforeunload', this.disconnectToWebsocket.bind(this));
    }

    sendParticipantDetails(type) {
        const data = { type: type || PARTICIPANT_CONNECTED, data: {
            participantDetails: getItemFromStore('localParticipant'),
        }}
        this.sendMessageViaSocket(data);
    }

    sendMessageViaSocket({ type, data}) {
        console.log('Sending message')
        console.log(JSON.stringify({ type }))
        this.webSocket.send(JSON.stringify({ type, data}));
    }

    socketOnMessage(e) {
        console.log('Websocket message')
        const participantDetails = getItemFromStore('localParticipant');
        const { type, data } = JSON.parse(e.data)
        console.log('type', type);
        switch (type) {
            case PARTICIPANT_CONNECTED: {
                 dispatchAction(addParticipant(data.participantDetails))
                 this.sendParticipantDetails(UPDATE_PARTICIPANT_DETAILS);
                 webrtcController.createPeerConnectionObject(data.participantDetails.id);
                 return
            }
            case UPDATE_PARTICIPANT_DETAILS: {
                const peerConnectionObject = peerConnections.getPeerconnectionObject(data.participantDetails.id)
                if (!peerConnectionObject) {
                  webrtcController.createPeerConnectionObject(data.participantDetails.id);
                }
                dispatchAction(addParticipant(data.participantDetails));
                return
            }
            case PARTICIPANT_DISCONNECTED: {
                dispatchAction(removeParticipant(data.participantDetails));
                return;
            }
            case OFFER: {
                if (data.toId === participantDetails.id) {
                    // Here we are pulling the from id peerConnection object
                    const peerConnectionObject = peerConnections.getPeerconnectionObject(data.fromId);
                    webrtcController.setRemoteDiscription(data.offer, peerConnectionObject)
                    webrtcController.createAnswer(data.fromId, peerConnectionObject);
                }
                return;
            }
            case ANSWER: {
                if (data.toId === participantDetails.id) {
                    const peerConnectionObject = peerConnections.getPeerconnectionObject(data.fromId);
                    webrtcController.setRemoteDiscription(data.answer, peerConnectionObject)
                }
                return;
            }
            case ICE_CANDIDATE: {
                if (data.toId === participantDetails.id) {
                    console.log(data)
                    const peerConnectionObject = peerConnections.getPeerconnectionObject(data.fromId);
                    webrtcController.setIceCandidate(data.candidate, peerConnectionObject);
                }
                return;
            }
            default:
                break;
        }
    }

    sendParticipantInfo() {
        const participantInfo = {
            type: PARTICIPANT_INFO,
            data: {
                participantDetails : {}
            }
        }
        this.sendMessageViaSocket(participantInfo)
    }

    socketOnClose(e) {
        console.log(e);
        console.log('Websocket closed')
        dispatchAction(setWebsocketDisconnected());
    }

    addEventListeners() {
        this.webSocket.onopen =  this.socketOnOpeon.bind(this);
        this.webSocket.onmessage = this.socketOnMessage.bind(this);
        this.webSocket.onclose = this.socketOnClose.bind(this);
    }
}

const signalingServer = new SignalingServer();
window.signalingServer = signalingServer
export default signalingServer;

