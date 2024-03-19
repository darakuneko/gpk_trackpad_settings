import React from 'react'
import {createContext, useState, useContext} from 'react'

const stateContext = createContext({})
const {api} = window

export function useStateContext() {
    return useContext(stateContext)
}

export function StateProvider({children}) {
    const [state, _setState] = useState({
        init: true,
        devices: [],
    })

    const setState = (obj) => {
        _setState({
            init: obj.init,
            devices: obj.devices
        })
        api.setConnectDevices(obj.devices)
    }

    const value = {
        state,
        setState
    }

    return (
        <stateContext.Provider value={value}>{children}</stateContext.Provider>
    )
}