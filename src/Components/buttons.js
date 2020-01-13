import React from 'react';
import { onClickStart, onClickHungUp, onClickCall } from '../js/controls/onClickStart';

const buttons = () => {
    return (
      <div className="box-controls">
        <button class="btn" id="startButton" onClick={onClickStart} >Start</button>
        <button class="btn" id="callButton" onClick={onClickCall}>Call</button>
        <button class="btn" id="hangupButton" onClick={onClickHungUp}>Hang Up</button>
      </div>
    );
};

export default buttons;