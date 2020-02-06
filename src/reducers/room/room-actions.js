import { constructPayload } from "../../js/utils/utils";

export const WEBSOCKET_CONNECTED = 'WEBSOCKET_CONNECTED';
export const WEBSOCKET_DISCONNECTED = 'WEBSOCKET_DISCONNECTED';
export const WEBRTC_CONNECTED = 'WEBRTC_CONNECTED';
export const WEBRTC_DISCONNECTED = 'WEBRTC_DISCONNECTED';


export const setWebsocketConnected = () => constructPayload(WEBSOCKET_CONNECTED);
export const setWebsocketDisconnected = () => constructPayload(WEBSOCKET_DISCONNECTED);

export const setWebrtcConnected = () => constructPayload(WEBRTC_CONNECTED);
export const setWebrtcDisconnected = () => constructPayload(WEBRTC_DISCONNECTED);