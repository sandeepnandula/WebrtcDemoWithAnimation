import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const AudioView = ({ audioClassName='', streamObject }) => {
  const node = useRef();
  useEffect(() => {
    if (streamObject instanceof MediaStream) {
      node.current.srcObject = streamObject;
     }
  }, [streamObject, audioClassName]);

  return (
        <audio ref={node} className={audioClassName} autoPlay ></audio>
  );
};

AudioView.propTypes = {
  streamObject: PropTypes.object,
  audioClassName: PropTypes.string,
};

AudioView.defaultProps = {
  audioClassName: '',
  streamObject: null,
};


export default AudioView;
