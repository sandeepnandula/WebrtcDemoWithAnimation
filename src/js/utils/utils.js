

export const getRoomName = () => {
    return window.location.pathname.substr(1);
}

export const constructPayload = (type, data = {}) => {
    return { type, data };
}

export const getMediaStreamObjectByTrack = (track) => {
    if (!track) return {}
    const streamObj = new MediaStream();
    streamObj.addTrack(track);
    return streamObj
}
