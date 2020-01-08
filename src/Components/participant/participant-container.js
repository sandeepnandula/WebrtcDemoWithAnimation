import React from 'react';
import { connect } from 'react-redux';

import {Audio} from './audio';
import {Video} from './video';
import { getMediaStreamObjectByTrack } from '../../js/utils/utils';
import webrtcController from '../../js/webrtc/webrtcController';

const participantContainer = ({ participantId, videoStream, audioStream, isLocal }) => {
        return (
           <React.Fragment>
               {!isLocal  && <Audio streamObject={audioStream}/>}
               <Video streamObject={videoStream} />
           </React.Fragment>
        );
}


const mapStateToProps = (store, { participantId, isLocal }) => {
    let audioStream;
    let videoStream;
    if (isLocal) {
        audioStream = window.localStreamObject && window.localStreamObject.getTrackById(store.localParticipant.audioTrackId);
        videoStream = window.localStreamObject && window.localStreamObject.getTrackById(store.localParticipant.videoTrackId);
        return {
            participantId,
            audioStream: audioStream ? getMediaStreamObjectByTrack(audioStream) : '',
            videoStream: videoStream && getMediaStreamObjectByTrack(videoStream),
            isLocal,
        }
    }
    const participant = store.participants[participantId];
    const audioTrack = webrtcController.getTrackById(participant.audioTrackId);
    const videoTrack = webrtcController.getTrackById(participant.videoTrackId);
    return {
        audioStream: getMediaStreamObjectByTrack(audioTrack) || {},
        videoStream: getMediaStreamObjectByTrack(videoTrack) || {},
        isLocal,
    }
   
  };
  
  
  export default connect(mapStateToProps, null)(participantContainer);
