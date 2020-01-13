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
    let videoStream;
    if (isLocal) {
        videoStream = window.localStreamObject && window.localStreamObject.getTrackById(store.localParticipant.videoTrackId);
        return {
            participantId,
            videoStream: videoStream && getMediaStreamObjectByTrack(videoStream),
            isLocal,
        }
    }
    const participant = store.participants[participantId];
    const audioTrack = webrtcController.getTrackById(participant.audioTrackId, participantId);
    const videoTrack = webrtcController.getTrackById(participant.videoTrackId, participantId);
    return {
        audioStream: audioTrack && getMediaStreamObjectByTrack(audioTrack),
        videoStream: videoTrack && getMediaStreamObjectByTrack(videoTrack),
        isLocal,
    }
   
  };
  
  
  export default connect(mapStateToProps, null)(participantContainer);
