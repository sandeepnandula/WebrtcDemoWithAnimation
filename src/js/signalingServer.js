import { SIGNALING_URL } from "./constants";
import { socketAccessToken } from "../config";

class SignalingServer {
    constructor() {
        this.channelId = 77;
        this.socketUrl = `${SIGNALING_URL}/${this.channelId}?token=${socketAccessToken}`;
        this.webSocket = null;
    }

    connectToWebsocket()  {
        this.webSocket = new WebSocket(this.socketUrl);
        this.addEventListeners();
    }

    socketOnOpeon(e) {
        console.log(e);
        console.log('Websocket is connected')
        const data = { type: 'participantConnected', data: {
            participantDetails: {},
        }}
        this.sendMessageViaSocket(data)
    }

    sendMessageViaSocket({ type, data}) {
        this.webSocket.send(JSON.stringify({ type, data}));
    }

    socketOnMessage(e) {
        console.log('Websocket message')
        console.log(JSON.parse(e.data))
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
window.signalingServer = signalingServer;
export default signalingServer;

