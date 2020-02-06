import { getRoomName } from "../../js/utils/utils";
import { WEBSOCKET_CONNECTED, WEBSOCKET_DISCONNECTED, WEBRTC_CONNECTED, WEBRTC_DISCONNECTED } from "./room-actions";


const initialRoomInfoState = {
   id: getRoomName(),
   websocketConnected: false,
   connectedToWebrtc: false,
}

const roomInfo = (state = initialRoomInfoState, { type, data }) => {
    switch (type) {
        case WEBSOCKET_CONNECTED:
            return {
                ...state,
                websocketConnected: true,
            } 
        case WEBSOCKET_DISCONNECTED:
            return {
                ...state,
                websocketConnected: false,
            }
        case WEBRTC_CONNECTED:
            return {
                ...state,
                connectedToWebrtc: true,
            } 
        case WEBRTC_DISCONNECTED:
            return {
                ...state,
                connectedToWebrtc: false,
            }
        default:
            return state;
    }
}

export {
    roomInfo,
}