class PeerConnections {
    construction() {
        this.peerConnectionObjects = null;
    }

    getMap() {
        return this.peerConnectionObjects;
    }

    getPeerconnectionObject(participantId) {
        if (participantId) {
            const map = this.getMap();
            if (map) {
               return map.get(participantId);
            }
        }
    }

    setPeerConnectionObject(participantId, peerConnectionObject) {
        if(participantId && peerConnectionObject) {
            const map =  this.getMap();
            map.set(participantId, peerConnectionObject)
        }
    }
}

const peerConnections = new PeerConnections()

window.peerConnectionObjects = peerConnections;

export default peerConnections;
