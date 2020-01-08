import { constructPayload } from "../../js/utils/utils";

export const PARTICIPANT_CONNECTED = 'PARTICIPANT_CONNECTED';
export const PARTICIPANT_DISCONNECTED = 'PARTICIPANT_DISCONNECTED';
export const ADD_AUDIO_TRACK = 'ADD_AUDIO_TRACK';
export const ADD_VIDEO_TRACK = 'ADD_VIDEO_TRACK';
export const ADD_PARTICIPANT = 'ADD_PARTICIPANT';
export const DISCONNECT_CALL = 'DISCONNECT_CALL';
export const TRACK_ADDED = 'TRACK_ADDED';
export const MEDIA_STREAM = 'MEDIA_STREAM';

export const addAudioTrackID = data => constructPayload(ADD_AUDIO_TRACK, data );
export const addVideoTrackID = data => constructPayload(ADD_VIDEO_TRACK, data );
export const addParticipant = data => constructPayload(ADD_PARTICIPANT, data);
export const removeParticipant = data => constructPayload(PARTICIPANT_DISCONNECTED, data);
export const trackAdded = data => constructPayload(TRACK_ADDED, data);
export const addMediaStreamId = data => constructPayload(MEDIA_STREAM, data);