import { getRoomName } from "../../js/utils/utils";


const initialRoomInfoState = {
   id: getRoomName(),
}

const roomInfo = (state = initialRoomInfoState, { type, data }) => {
    switch (type) {    
        default:
            return state;
    }
}

export {
    roomInfo,
}