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

export {
  getItemFromStore,
  dispatchAction,
  getStore,
  getLocalUserId,
};
