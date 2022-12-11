import socketContext from "./socketContext";


import React from 'react';

const SocketProvidor = ({ children, socket }) => {


    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    );
}

export default SocketProvidor;
