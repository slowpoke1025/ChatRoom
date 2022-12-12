

export default function chatReducer(state, action) {
    let _state = [...state];
    console.log(action)
    const { id } = action.data;
    switch (action.type) {
        case "INIT":
            return action.data;

        case "POP_UP":
        case "ADD_UNREAD":
            const { generateChatKeys } = action.data
            const contact = _state.splice(id, 1);
            if (action.type === "ADD_UNREAD") contact[0].unread += 1;
            _state = [contact[0], ..._state];
            generateChatKeys(_state)
            break;
        case "RM_UNREAD":
            _state[id].unread = 0;
            break;
        case "SELECT":
            const { origin } = action.data
            if (origin != null) _state[origin].select = false
            _state[id].select = true
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


