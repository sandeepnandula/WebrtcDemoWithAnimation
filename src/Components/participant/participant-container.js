import React from 'react';
import { connect } from 'react-redux';

import {Audio} from './audio';
import {Video} from './video';
import { getMediaStreamObjectByTrack } from '../../js/utils/utils';

const participantContainer = ({ participantId, videoTrack, audioTrack }) => {
        return (
           <React.Fragment>
               <Audio streamObject={audioTrack}/>
               <Video streamObject={videoTrack} />
           </React.Fragment>
        );
}


const mapStateToProps = (store, { participantId, isLocal }) => {
    let audioTrack;
    let videoTrack;
    if (isLocal) {
        audioTrack = window.localStreamObject && window.localStreamObject.getTrackById(store.localParticipant.audioTrackId);
        videoTrack = window.localStreamObject && window.localStreamObject.getTrackById(store.localParticipant.videoTrackId);
        return {
            participantId,
            audioTrack: audioTrack ? getMediaStreamObjectByTrack(audioTrack) : '',
            videoTrack: videoTrack && getMediaStreamObjectByTrack(videoTrack),
        }
    } return {
        audioTrack: {},
        videoTrack: {},
    }
   
  };
  
  
  export default connect(mapStateToProps, null)(participantContainer);
