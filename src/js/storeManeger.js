import store from '../appStore';


function getStore() {
  return store;
}

function getState() {
  return getStore().getState();
}

function getItemFromStore(item) {
  if (typeof item === 'string') {
    const state = getState();
    return state[item];
  }
  return null;
}

function dispatchAction(action) {
  getStore().dispatch(action);
}

function getLocalUserId() {
  const localUser = getItemFromStore('localParticipant')
  return localUser.id;
}


const getParticipantIdByStreamId = (id) => {
  let participantId;
  const participantsObj = getItemFromStore('participants');
  const participants = Object.values(participantsObj);
  participants.forEach(participant => {
      if(participant.mediaStreamId === id) {
        participantId = participant.id;
      }
  });
  return participantId
}
export {
  getItemFromStore,
  dispatchAction,
  getStore,
  getLocalUserId,
  getParticipantIdByStreamId,
};
