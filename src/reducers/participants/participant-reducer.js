import { generateUserId } from "../../js/utils/idGenerator";
import generateName from 'sillyname';
import { ADD_AUDIO_TRACK, ADD_VIDEO_TRACK, ADD_PARTICIPANT, DISCONNECT_CALL, TRACK_ADDED } from "./participant-actions";
import { PARTICIPANT_DISCONNECTED } from "../../js/constants";

const initialLocalParticipantState = {
    id: generateUserId(),
    name: generateName().split(' ')[0],
    audioTrackId: '',
    videoTrackId: '',
}

const participant = (state, { type, data }) => {
    switch (type) {
        case ADD_PARTICIPANT:
            return {
                id: data.id,
                name: data.name,
                audioTrackId: data.audioTrackId,
                videoTrackId: data.videoTrackId,
                audioTrack: '',
                videoTrack: '',
                connected: false,
            }
        case ADD_AUDIO_TRACK:
            return {
                ...state,
                audioTrackId: data.id,
            }
        case ADD_VIDEO_TRACK:
            return {
                ...state,
                videoTrackId: data.id,
            }
        case TRACK_ADDED: {
            if (data.track.kind === 'audio') {
                return {
                    ...state,
                    audioTrackId: data.track.id,
                }
            } else if (data.track.kind === 'video') {
                return { 
                    ...state,
                    videoTrackId: data.track.id,
                }
            }
            return state;
        }
        default:
            return state;
    }
}

const participants = (state = {}, { type, data }) => {
    switch (type) {
        case PARTICIPANT_DISCONNECTED: {
            const { [data.id]: deleted, ...rest } = state;
            return rest;
        }
        case ADD_PARTICIPANT:
        case TRACK_ADDED:
            return {
                ...state,
                [data.id]: participant(state[data.id], { type, data }),
            };
        case DISCONNECT_CALL:
            return {}
        default:
            return state;
    }
}

const localParticipant = (state = initialLocalParticipantState, { type, data }) => {
    switch (type) {
        case ADD_AUDIO_TRACK:
        case ADD_VIDEO_TRACK:
            return {
                ...participant(state, { type, data }),
            };
        default:
            return state;
    }
}

export {
    localParticipant,
    participants,
}