import React from 'react';
import { onClickStart, onClickHungUp } from '../js/controls/onClickStart';

const buttons = () => {
    return (
        <div className="box-controls">
        <button id="startButton" onClick={onClickStart} >Start</button>
        <button id="callButton">Call</button>
        <button id="hangupButton" onClick={onClickHungUp}>Hang Up</button>
      </div>
    );
};

export default buttons;