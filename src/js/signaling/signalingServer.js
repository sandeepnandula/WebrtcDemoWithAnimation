import { SIGNALING_URL, PARTICIPANT_CONNECTED, PARTICIPANT_DISCONNECTED, PARTICIPANT_INFO } from "../constants";
import { socketAccessToken } from "../../config";
import { getRoomName } from "../utils/utils";
import { getItemFromStore } from "../storeManeger";

class SignalingServer {
    constructor() {
        this.channelId = getRoomName();
        this.socketUrl = `${SIGNALING_URL}/${this.channelId}?token=${socketAccessToken}`;
        this.webSocket = null;
    }

    connectToWebsocket()  {
        this.webSocket = new WebSocket(this.socketUrl);
        this.addEventListeners();
    }

    disconnectToWebsocket() {
        const clossingMessage = { type: PARTICIPANT_DISCONNECTED, data: {
            participantDetails: {},
        }}
        this.sendMessageViaSocket(clossingMessage);
        this.webSocket.close()
    }

    socketOnOpeon(e) {
        console.log(e);
        console.log('Websocket is connected')
        const data = { type: PARTICIPANT_CONNECTED, data: {
            participantDetails: getItemFromStore('localParticipant'),
        }}
        this.sendMessageViaSocket(data);
        window.addEventListener('beforeunload', this.disconnectToWebsocket.bind(this));
    }

    sendMessageViaSocket({ type, data}) {
        console.log('Sending message')
        console.log(JSON.stringify({ type, data}))
        this.webSocket.send(JSON.stringify({ type, data}));
    }

    socketOnMessage(e) {
        console.log('Websocket message')
        const { type, data } = JSON.parse(e.data)
        console.log(data)
        switch (type) {
            case PARTICIPANT_CONNECTED:
            
                // this.sendParticipantInfo();
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
    }

    addEventListeners() {
        this.webSocket.onopen =  this.socketOnOpeon.bind(this);
        this.webSocket.onmessage = this.socketOnMessage.bind(this);
        this.webSocket.onclose = this.socketOnClose.bind(this);
    }
}

const signalingServer = new SignalingServer();
export default signalingServer;

