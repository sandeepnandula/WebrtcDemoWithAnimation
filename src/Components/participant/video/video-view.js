import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const VideoView = ({ videoClassName='', streamObject }) => {
  const node = useRef();
  useEffect(() => {
    if (streamObject instanceof MediaStream) {
      node.current.srcObject = streamObject;
     }
  }, [streamObject, videoClassName]);

  return (
        <video ref={node} className={videoClassName} autoPlay ></video>
  );
};

VideoView.propTypes = {
  streamObject: PropTypes.object,
  videoClassName: PropTypes.string,
};

VideoView.defaultProps = {
  videoClassName: '',
  streamObject: null,
};


export default VideoView;
