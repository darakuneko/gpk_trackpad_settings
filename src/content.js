import React, {  useEffect, useRef, useState } from 'react'
import Setting from "./renderer/setting"
import { css } from "@emotion/react";

const {api} = window

import {useStateContext} from "./context"
import {SettingsPrecautionary} from "./style";

const style = css`paddingTop: "40px"`;

const Content = () => {
    const {state, setState} = useStateContext()

    useEffect(  () => {
        const intervalId = setInterval(async () => {
            try {
                await api.keyboardSendLoop();
            } catch (error) {
                console.log("Error in timer:", error);
            }
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [])

    useEffect(() => {
        api.on("changeConnectDevice", (dat) => {
            console.log(dat)
            state.devices = dat
            state.init = false
            setState(state)
        })
        return () => {}
    }, [state])

    return (
        <div>
            <Setting/>
            <SettingsPrecautionary sx={{ pt: 2, pl: 4}}>Do not connect while using VIAL and GPK RC</SettingsPrecautionary>
        </div>
    )
}
export default Content