import React from "react";

import {SettingsPrecautionary, SettingsTitle} from "../style";
import Paper from "@mui/material/Paper";
import SettingEdit from "./settingEdit";

import {useStateContext} from "../context";

const {api} = window

const Setting = (() => {
    const {state} = useStateContext();
    return (
        <Paper elevation={0}>
            <div>
                {state.devices && state.devices.map((d) => (
                    <div key={d.id}>
                        {d.connected && <SettingEdit device={d}/>}
                    </div>
                ))}
            </div>
</Paper>)
})

export default Setting