import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

// import {InteractiveForceGraph, ForceGraphNode, ForceGraphLink} from 'react-vis-force';
import signalingServer from '../js/signaling/signalingServer';
import Buttons from './buttons';
import { Participant } from './participant';

const  App = ({ participantId }) => {
  useEffect(() => {
    // signalingServer.connectToWebsocket();
  }, [])
  return (
    <div className="app">
          <div className='video-layout'>
            <div className='flex-container'>
                <Participant participantID={participantId} isLocal/>
            </div>
            <Buttons />
          </div>
          <div className='animation'> 
            <h1>Connections</h1>
          </div>
    </div>
  );
}

const mapStateToProps = store => ({
  participantId: store.localParticipant.id,
  participants: store.participants,
});


export default connect(mapStateToProps, null)(App);

