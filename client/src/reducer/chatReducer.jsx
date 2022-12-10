

export default function chatReducer(state, action) {
    const _state = [...state];
    console.log(action)
    const { id } = action.data;
    switch (action.type) {
        case "INIT":
            return action.data;

        case "ADD_UNREAD":
            console.log(_state[id]);
            _state[id].unread += 0.5;
            break;
        case "RM_UNREAD":
            _state[id].unread = 0;
            break;
        case "ONLINE":
            _state[id].online = true;
            break;
        case "OFFLINE":
            _state[id].online = false;
            break;
        default:
            return state;
    }
    return _state;
}


