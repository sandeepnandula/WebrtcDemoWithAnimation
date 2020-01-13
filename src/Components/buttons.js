import React from 'react';
import { onClickStart, onClickHungUp, onClickCall } from '../js/controls/onClickStart';

const buttons = () => {
    return (
      <div className="box-controls">
        <button className="btn" id="startButton" onClick={onClickStart} >Start</button>
        <button className="btn" id="callButton" onClick={onClickCall}>Call</button>
        <button className="btn" id="hangupButton" onClick={onClickHungUp}>Hang Up</button>
      </div>
    );
};

export default buttons;