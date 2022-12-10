import chatKeysContext from "./chatKeysContext";

import React from 'react';

const ChatKeysProvidor = ({ children, value }) => {
    return (
        <chatKeysContext.Provider value={value}>
            {children}
        </chatKeysContext.Provider>
    );
}

export default ChatKeysProvidor;
