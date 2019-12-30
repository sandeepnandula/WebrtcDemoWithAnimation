import * as participantReducer from "./reducers/participants/participant-reducer";
import * as roomReducer from './reducers/room/room-reducer';
import createReduxStore from "./store/storeCreator";


// console.log(participantReducer)
const store = createReduxStore({
    ...participantReducer,
    ...roomReducer,
})

export default store;
