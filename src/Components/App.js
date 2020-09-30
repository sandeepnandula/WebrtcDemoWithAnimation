import React, { useEffect } from 'react';
import { connect } from 'react-redux';

// import {InteractiveForceGraph, ForceGraphNode, ForceGraphLink} from 'react-vis-force';
// import signalingServer from '../js/signaling/signalingServer';
import Buttons from './buttons';
import { Participant } from './participant';

const App = ({ participantId, participants, websocketConnected }) => {
  useEffect(() => {
    // signalingServer.connectToWebsocket();
  }, [])
  return (
    <div className="app">

      <h1>MESH Architecture</h1>

      <div className='video-layout'>
        <div className='video-wrapper'>
          <Participant participantID={participantId} isLocal />
          {participants.map(participant => {
            return (<Participant participantId={participant.id} />)
          })}
        </div>
        <Buttons websocketConnected={websocketConnected}/>
      </div>

      <div className="animation-layout">

      <div className="animation-container">
      <svg className="svg" width="350" height="350" viewBox="0 0 325 325" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <defs>
            <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a6cd3b" />
              <stop offset="100%" stopColor="#2980b8" />
            </linearGradient>
      </defs>
        <circle r="100" cx="50%" cy="50%" fill="transparent" strokeDasharray="628" stroke="#e2e2e2" strokeDashoffset="0"></circle>
        <circle className={`bar a2b ${participants.length >= 1 ? 'animate' : ''}`} r="100" cx="50%" cy="50%" fill="transparent" stroke="url(#linear)" strokeWidth="5" strokeDasharray="628" strokeDashoffset="0" transform='rotate(-180)' ></circle>
        <circle className={`bar b2a ${participants.length >= 1 ? 'animate' : ''}`} r="125" cx="50%" cy="50%" fill="transparent" stroke="url(#linear)" strokeWidth="5" strokeDasharray="785" strokeDashoffset="0" transform='rotate(-60)'></circle>
        <circle className={`bar a2c ${participants.length >= 2 ? 'animate' : ''}`} r="100" cx="50%" cy="50%" fill="transparent" stroke="url(#linear)" strokeWidth="5" strokeDasharray="628" strokeDashoffset="0" transform='rotate(-180)' ></circle>
        <circle className={`bar c2a ${participants.length >= 2 ? 'animate' : ''}`} r="125" cx="50%" cy="50%" fill="transparent" stroke="url(#linear)" strokeWidth="5" strokeDasharray="785" strokeDashoffset="0" transform='rotate(60)'></circle>
        <circle className={`bar c2b ${participants.length >= 2 ? 'animate' : ''}`} r="100" cx="50%" cy="50%" fill="transparent" stroke="url(#linear)" strokeWidth="5" strokeDasharray="628" strokeDashoffset="0" transform='rotate(60)' ></circle>
        <circle className={`bar b2c ${participants.length >= 2 ? 'animate' : ''}`} r="125" cx="50%" cy="50%" fill="transparent" stroke="url(#linear)" strokeWidth="5" strokeDasharray="785" strokeDashoffset="0" transform='rotate(300)'></circle>  
        </svg>
        {websocketConnected && <div className="avatar avatar--a">A</div>}
        {participants.length >= 1 && <div className="avatar avatar--b">B</div>}
        {participants.length >= 2 && <div className="avatar avatar--c">C</div>}
      </ div>
      </div>
      
    </div>
  );
}

const mapStateToProps = store => ({
  participantId: store.localParticipant.id,
  participants: Object.values(store.participants),
  websocketConnected: store.roomInfo.websocketConnected,
});


export default connect(mapStateToProps, null)(App);

