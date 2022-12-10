import { createContext } from "react";

export const initChatKeys = {
    data: [],
    generate: () => { },
}

export default createContext(initChatKeys)

