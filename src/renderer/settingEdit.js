import React from "react"
import Box from "@mui/material/Box"

import {useStateContext} from "../context"
import {
    SettingInputs,
} from "../style"
import {Button, Divider, FormControlLabel, InputLabel, MenuItem, Select, Slider, Switch} from "@mui/material"
const {api} = window

const SettingEdit = ((props) => {
    const {state, setState} = useStateContext()

    const device = props.device
    function valueLabelScrollStepFormat(value) {
        const displayValue = value + 1
        return (
            <span {...displayValue}>{displayValue}</span>
        )
    }

    const handleChange =(pType, id) => async (event) => {
        const dat = await Promise.all(state.devices.map( async (d) => {
            if(d.id === id) {
                if(pType === "can_hf_for_layer" || pType === "can_drag"
                    || pType === "can_trackpad_layer" || pType === "can_reverse_scrolling_direction") {
                    d.config[pType] = event.target.checked ? 1 : 0
                } else {
                    d.config[pType] = pType === "default_speed" ? event.target.value * 10 : parseInt(event.target.value)
                }
                d.config.changed = true
            }
            return d
        }))
        state.devices = dat
        setState(state)
    }

    return (
        <Box key={`${device.id}`} sx={{ pb: 2 }}>
            <SettingInputs>
                <Box sx={{ pt: 1, pl: 2 }}>{device.product}</Box>
            </SettingInputs>
            {device.config && device.config.init &&(
                <Box sx={{
                    pl: 4,
                    pr: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    maxWidth: '1200px'
                }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignContent: 'center',
                            justifyContent: 'space-evenly'
                        }}>
                        <Box sx={{pt: 2, pr: 4, width: 250}}>
                            <InputLabel sx={{textAlign: "center"}}>Mouse Speed</InputLabel>
                            <Slider
                                id="config-default_speed"
                                value={device.config.default_speed ? device.config.default_speed / 10 : 0}
                                min={0.1}
                                step={0.1}
                                max={5}
                                valueLabelDisplay="auto"
                                marks={[{value: 0.1, label: '0.1'}, {value: 1.0, label: '1.0'}, {
                                    value: 5.0,
                                    label: '5.0'
                                }]}
                                onChange={handleChange("default_speed", device.id)}
                            />
                        </Box>
                        <Box sx={{pt: 2, width: 200, textAlign: "center"}}>
                            <FormControlLabel
                                control={<Switch
                                    id="config-can_reverse_scrolling_direction"
                                    onChange={handleChange("can_reverse_scrolling_direction", device.id)}
                                    checked={device.config.can_reverse_scrolling_direction === 1}
                                />}
                                labelPlacement="top"
                                label="Reverse Scrolling Direction"/>
                        </Box>
                        <Box sx={{pt: 2, pr: 6, width: 250}}>
                            <InputLabel sx={{textAlign: "center"}}>Scroll Term</InputLabel>
                            <Slider
                                id="config-scroll_term"
                                value={device.config.scroll_term ? device.config.scroll_term : 0}
                                min={0}
                                step={10}
                                max={300}
                                valueLabelDisplay="auto"
                                marks={[
                                    {value: 0, label: '0'},
                                    {value: 100, label: '100'},
                                    {value: 300, label: '300 ms'}
                                ]}
                                onChange={handleChange("scroll_term", device.id)}
                            />
                        </Box>
                        <Box sx={{pt: 2, pr: 2, width: 250}}>
                            <InputLabel sx={{textAlign: "center"}}>Scroll Step</InputLabel>
                            <Slider
                                id="config-scroll_step"
                                value={device.config.scroll_step ? device.config.scroll_step : 0}
                                min={0}
                                step={1}
                                max={15}
                                valueLabelFormat={valueLabelScrollStepFormat}
                                valueLabelDisplay="auto"
                                marks={[
                                    {value: 0, label: '1'},
                                    {value: 15, label: '16 line'}
                                ]}
                                onChange={handleChange("scroll_step", device.id)}
                            />
                        </Box>
                    </Box>
                    <Divider sx={{pt: 1, pb: 1, width: '100%'}}/>
                    <Box
                        sx={{
                            display: 'flex',
                            alignContent: 'center',
                            justifyContent: 'space-evenly'
                        }}>
                        <Box sx={{pt: 2, width: 120, textAlign: "left"}}>
                            <FormControlLabel
                                control={<Switch
                                    id="config-can_drag"
                                    onChange={handleChange("can_drag", device.id)}
                                    checked={device.config.can_drag === 1}
                                />}
                                labelPlacement="top"
                                label="Drag&Drop"/>
                        </Box>
                        <Box sx={{pt: 2, width: 130, textAlign: "center"}}>
                            <InputLabel>Drag Mode</InputLabel>
                            <Select
                                id="config-drag_strength_mode"
                                label={"Drag Mode"}
                                value={device.config.drag_strength_mode !== undefined ? device.config.drag_strength_mode : ''}
                                onChange={handleChange("drag_strength_mode", device.id)}
                                required>
                                <MenuItem key="drag_strength_mode0" value="0">Term</MenuItem>
                                <MenuItem key="drag_strength_mode1" value="1">Strength</MenuItem>
                            </Select>
                        </Box>
                        <Box sx={{pt: 2, pr: 6, width: 250}}>
                            <InputLabel sx={{textAlign: "center"}}>Drag Term</InputLabel>
                            <Slider
                                id="config-drag_term"
                                value={device.config.drag_term ? device.config.drag_term : 0}
                                min={0}
                                step={10}
                                max={1000}
                                valueLabelDisplay="auto"
                                marks={[{value: 0, label: '0'}, {value: 500, label: '500'}, {
                                    value: 1000,
                                    label: '1000 ms'
                                }]}
                                onChange={handleChange("drag_term", device.id)}
                            />
                        </Box>
                        <Box sx={{pt: 2, pr: 2, width: 250}}>
                            <InputLabel sx={{textAlign: "center"}}>Drag Strength</InputLabel>
                            <Slider
                                id="config-drag_strength"
                                value={device.config.drag_strength ? device.config.drag_strength : 0}
                                min={1}
                                step={1}
                                max={12}
                                valueLabelDisplay="auto"
                                marks={[{value: 1, label: '1'}, {value: 6, label: '6'}, {value: 12, label: '12'}]}
                                onChange={handleChange("drag_strength", device.id)}
                            />
                        </Box>
                    </Box>
                    <Divider sx={{pt: 1, pb: 1, width: '100%'}}/>
                    <Box
                        sx={{
                            display: 'flex',
                            alignContent: 'center',
                            justifyContent: 'space-evenly'
                        }}>
                        <Box sx={{pt: 2, width: 200, textAlign: "center"}}>
                            <FormControlLabel
                                control={<Switch
                                    id="config-can_hf_for_layer"
                                    onChange={handleChange("can_hf_for_layer", device.id)}
                                    checked={device.config.can_hf_for_layer === 1}
                                />}
                                labelPlacement="top"
                                label="Layer move Haptic"/>
                        </Box>
                        <Box sx={{pt: 2, width: 250, textAlign: "center"}}>
                            <InputLabel>HF Waveform Number</InputLabel>
                            <Select
                                id="config-hf_waveform_number"
                                value={device.config.hf_waveform_number && device.config.hf_waveform_number !== 0 ? device.config.hf_waveform_number : ''}
                                onChange={handleChange("hf_waveform_number", device.id)}
                                required>
                                <MenuItem key="hf_waveform_number1" value="1">strong_click</MenuItem>
                                <MenuItem key="hf_waveform_number2" value="2">strong_click_60</MenuItem>
                                <MenuItem key="hf_waveform_number3" value="3">strong_click_30</MenuItem>
                                <MenuItem key="hf_waveform_number4" value="4">sharp_click</MenuItem>
                                <MenuItem key="hf_waveform_number5" value="5">sharp_click_60</MenuItem>
                                <MenuItem key="hf_waveform_number6" value="6">sharp_click_30</MenuItem>
                                <MenuItem key="hf_waveform_number7" value="7">soft_bump</MenuItem>
                                <MenuItem key="hf_waveform_number8" value="8">soft_bump_60</MenuItem>
                                <MenuItem key="hf_waveform_number9" value="9">soft_bump_30</MenuItem>
                                <MenuItem key="hf_waveform_number10" value="10">dbl_click</MenuItem>
                                <MenuItem key="hf_waveform_number11" value="11">dbl_click_60</MenuItem>
                                <MenuItem key="hf_waveform_number12" value="12">trp_click</MenuItem>
                                <MenuItem key="hf_waveform_number13" value="13">soft_fuzz</MenuItem>
                                <MenuItem key="hf_waveform_number14" value="14">strong_buzz</MenuItem>
                                <MenuItem key="hf_waveform_number15" value="15">alert_750ms</MenuItem>
                                <MenuItem key="hf_waveform_number16" value="16">alert_1000ms</MenuItem>
                                <MenuItem key="hf_waveform_number17" value="17">strong_click1</MenuItem>
                                <MenuItem key="hf_waveform_number18" value="18">strong_click2_80</MenuItem>
                                <MenuItem key="hf_waveform_number19" value="19">strong_click3_60</MenuItem>
                                <MenuItem key="hf_waveform_number20" value="20">strong_click4_30</MenuItem>
                                <MenuItem key="hf_waveform_number21" value="21">medium_click1</MenuItem>
                                <MenuItem key="hf_waveform_number22" value="22">medium_click2_80</MenuItem>
                                <MenuItem key="hf_waveform_number23" value="23">medium_click3_60</MenuItem>
                                <MenuItem key="hf_waveform_number24" value="24">sharp_tick1</MenuItem>
                                <MenuItem key="hf_waveform_number25" value="25">sharp_tick2_80</MenuItem>
                                <MenuItem key="hf_waveform_number26" value="26">sharp_tick3_60</MenuItem>
                                <MenuItem key="hf_waveform_number27" value="27">sh_dblclick_str</MenuItem>
                                <MenuItem key="hf_waveform_number28" value="28">sh_dblclick_str_80</MenuItem>
                                <MenuItem key="hf_waveform_number29" value="29">sh_dblclick_str_60</MenuItem>
                                <MenuItem key="hf_waveform_number30" value="30">sh_dblclick_str_30</MenuItem>
                                <MenuItem key="hf_waveform_number31" value="31">sh_dblclick_med</MenuItem>
                                <MenuItem key="hf_waveform_number32" value="32">sh_dblclick_med_80</MenuItem>
                                <MenuItem key="hf_waveform_number33" value="33">sh_dblclick_med_60</MenuItem>
                                <MenuItem key="hf_waveform_number34" value="34">sh_dblsharp_tick</MenuItem>
                                <MenuItem key="hf_waveform_number35" value="35">sh_dblsharp_tick_80</MenuItem>
                                <MenuItem key="hf_waveform_number36" value="36">sh_dblsharp_tick_60</MenuItem>
                                <MenuItem key="hf_waveform_number37" value="37">lg_dblclick_str</MenuItem>
                                <MenuItem key="hf_waveform_number38" value="38">lg_dblclick_str_80</MenuItem>
                                <MenuItem key="hf_waveform_number39" value="39">lg_dblclick_str_60</MenuItem>
                                <MenuItem key="hf_waveform_number40" value="40">lg_dblclick_str_30</MenuItem>
                                <MenuItem key="hf_waveform_number41" value="41">lg_dblclick_med</MenuItem>
                                <MenuItem key="hf_waveform_number42" value="42">lg_dblclick_med_80</MenuItem>
                                <MenuItem key="hf_waveform_number43" value="43">lg_dblclick_med_60</MenuItem>
                                <MenuItem key="hf_waveform_number44" value="44">lg_dblsharp_tick</MenuItem>
                                <MenuItem key="hf_waveform_number45" value="45">lg_dblsharp_tick_80</MenuItem>
                                <MenuItem key="hf_waveform_number46" value="46">lg_dblsharp_tick_60</MenuItem>
                                <MenuItem key="hf_waveform_number47" value="47">buzz</MenuItem>
                                <MenuItem key="hf_waveform_number48" value="48">buzz_80</MenuItem>
                                <MenuItem key="hf_waveform_number49" value="49">buzz_60</MenuItem>
                                <MenuItem key="hf_waveform_number50" value="50">buzz_40</MenuItem>
                                <MenuItem key="hf_waveform_number51" value="51">buzz_20</MenuItem>
                                <MenuItem key="hf_waveform_number52" value="52">pulsing_strong</MenuItem>
                                <MenuItem key="hf_waveform_number53" value="53">pulsing_strong_80</MenuItem>
                                <MenuItem key="hf_waveform_number54" value="54">pulsing_medium</MenuItem>
                                <MenuItem key="hf_waveform_number55" value="55">pulsing_medium_80</MenuItem>
                                <MenuItem key="hf_waveform_number56" value="56">pulsing_sharp</MenuItem>
                                <MenuItem key="hf_waveform_number57" value="57">pulsing_sharp_80</MenuItem>
                                <MenuItem key="hf_waveform_number58" value="58">transition_click</MenuItem>
                                <MenuItem key="hf_waveform_number59" value="59">transition_click_80</MenuItem>
                                <MenuItem key="hf_waveform_number60" value="60">transition_click_60</MenuItem>
                                <MenuItem key="hf_waveform_number61" value="61">transition_click_40</MenuItem>
                                <MenuItem key="hf_waveform_number62" value="62">transition_click_20</MenuItem>
                                <MenuItem key="hf_waveform_number63" value="63">transition_click_10</MenuItem>
                                <MenuItem key="hf_waveform_number64" value="64">transition_hum</MenuItem>
                                <MenuItem key="hf_waveform_number65" value="65">transition_hum_80</MenuItem>
                                <MenuItem key="hf_waveform_number66" value="66">transition_hum_60</MenuItem>
                                <MenuItem key="hf_waveform_number67" value="67">transition_hum_40</MenuItem>
                                <MenuItem key="hf_waveform_number68" value="68">transition_hum_20</MenuItem>
                                <MenuItem key="hf_waveform_number69" value="69">transition_hum_10</MenuItem>
                                <MenuItem key="hf_waveform_number70"
                                          value="70">transition_rampdown_long_smooth1</MenuItem>
                                <MenuItem key="hf_waveform_number71"
                                          value="71">transition_rampdown_long_smooth2</MenuItem>
                                <MenuItem key="hf_waveform_number72"
                                          value="72">transition_rampdown_med_smooth1</MenuItem>
                                <MenuItem key="hf_waveform_number73"
                                          value="73">transition_rampdown_med_smooth2</MenuItem>
                                <MenuItem key="hf_waveform_number74"
                                          value="74">transition_rampdown_short_smooth1</MenuItem>
                                <MenuItem key="hf_waveform_number75"
                                          value="75">transition_rampdown_short_smooth2</MenuItem>
                                <MenuItem key="hf_waveform_number76"
                                          value="76">transition_rampdown_long_sharp1</MenuItem>
                                <MenuItem key="hf_waveform_number77"
                                          value="77">transition_rampdown_long_sharp2</MenuItem>
                                <MenuItem key="hf_waveform_number78"
                                          value="78">transition_rampdown_med_sharp1</MenuItem>
                                <MenuItem key="hf_waveform_number79"
                                          value="79">transition_rampdown_med_sharp2</MenuItem>
                                <MenuItem key="hf_waveform_number80"
                                          value="80">transition_rampdown_short_sharp1</MenuItem>
                                <MenuItem key="hf_waveform_number81"
                                          value="81">transition_rampdown_short_sharp2</MenuItem>
                                <MenuItem key="hf_waveform_number82"
                                          value="82">transition_rampup_long_smooth1</MenuItem>
                                <MenuItem key="hf_waveform_number83"
                                          value="83">transition_rampup_long_smooth2</MenuItem>
                                <MenuItem key="hf_waveform_number84" value="84">transition_rampup_med_smooth1</MenuItem>
                                <MenuItem key="hf_waveform_number85" value="85">transition_rampup_med_smooth2</MenuItem>
                                <MenuItem key="hf_waveform_number86"
                                          value="86">transition_rampup_short_smooth1</MenuItem>
                                <MenuItem key="hf_waveform_number87"
                                          value="87">transition_rampup_short_smooth2</MenuItem>
                                <MenuItem key="hf_waveform_number88" value="88">transition_rampup_long_sharp1</MenuItem>
                                <MenuItem key="hf_waveform_number89" value="89">transition_rampup_long_sharp2</MenuItem>
                                <MenuItem key="hf_waveform_number90" value="90">transition_rampup_med_sharp1</MenuItem>
                                <MenuItem key="hf_waveform_number91" value="91">transition_rampup_med_sharp2</MenuItem>
                                <MenuItem key="hf_waveform_number92"
                                          value="92">transition_rampup_short_sharp1</MenuItem>
                                <MenuItem key="hf_waveform_number93"
                                          value="93">transition_rampup_short_sharp2</MenuItem>
                                <MenuItem key="hf_waveform_number94"
                                          value="94">transition_rampdown_long_smooth1_50</MenuItem>
                                <MenuItem key="hf_waveform_number95"
                                          value="95">transition_rampdown_long_smooth2_50</MenuItem>
                                <MenuItem key="hf_waveform_number96"
                                          value="96">transition_rampdown_med_smooth1_50</MenuItem>
                                <MenuItem key="hf_waveform_number97"
                                          value="97">transition_rampdown_med_smooth2_50</MenuItem>
                                <MenuItem key="hf_waveform_number98"
                                          value="98">transition_rampdown_short_smooth1_50</MenuItem>
                                <MenuItem key="hf_waveform_number99"
                                          value="99">transition_rampdown_short_smooth2_50</MenuItem>
                                <MenuItem key="hf_waveform_number100"
                                          value="100">transition_rampdown_long_sharp1_50</MenuItem>
                                <MenuItem key="hf_waveform_number101"
                                          value="101">transition_rampdown_long_sharp2_50</MenuItem>
                                <MenuItem key="hf_waveform_number102"
                                          value="102">transition_rampdown_med_sharp1_50</MenuItem>
                                <MenuItem key="hf_waveform_number103"
                                          value="103">transition_rampdown_med_sharp2_50</MenuItem>
                                <MenuItem key="hf_waveform_number104"
                                          value="104">transition_rampdown_short_sharp1_50</MenuItem>
                                <MenuItem key="hf_waveform_number105"
                                          value="105">transition_rampdown_short_sharp2_50</MenuItem>
                                <MenuItem key="hf_waveform_number106"
                                          value="106">transition_rampup_long_smooth1_50</MenuItem>
                                <MenuItem key="hf_waveform_number107"
                                          value="107">transition_rampup_long_smooth2_50</MenuItem>
                                <MenuItem key="hf_waveform_number108"
                                          value="108">transition_rampup_med_smooth1_50</MenuItem>
                                <MenuItem key="hf_waveform_number109"
                                          value="109">transition_rampup_med_smooth2_50</MenuItem>
                                <MenuItem key="hf_waveform_number110"
                                          value="110">transition_rampup_short_smooth1_50</MenuItem>
                                <MenuItem key="hf_waveform_number111"
                                          value="111">transition_rampup_short_smooth2_50</MenuItem>
                                <MenuItem key="hf_waveform_number112"
                                          value="112">transition_rampup_long_sharp1_50</MenuItem>
                                <MenuItem key="hf_waveform_number113"
                                          value="113">transition_rampup_long_sharp2_50</MenuItem>
                                <MenuItem key="hf_waveform_number114"
                                          value="114">transition_rampup_med_sharp1_50</MenuItem>
                                <MenuItem key="hf_waveform_number115"
                                          value="115">transition_rampup_med_sharp2_50</MenuItem>
                                <MenuItem key="hf_waveform_number116"
                                          value="116">transition_rampup_short_sharp1_50</MenuItem>
                                <MenuItem key="hf_waveform_number117"
                                          value="117">transition_rampup_short_sharp2_50</MenuItem>
                                <MenuItem key="hf_waveform_number118"
                                          value="118">long_buzz_for_programmatic_stopping</MenuItem>
                                <MenuItem key="hf_waveform_number119" value="119">smooth_hum1_50</MenuItem>
                                <MenuItem key="hf_waveform_number120" value="120">smooth_hum2_40</MenuItem>
                                <MenuItem key="hf_waveform_number121" value="121">smooth_hum3_30</MenuItem>
                                <MenuItem key="hf_waveform_number122" value="122">smooth_hum4_20</MenuItem>
                                <MenuItem key="hf_waveform_number123" value="123">smooth_hum5_10</MenuItem>
                            </Select>
                        </Box>
                        {device.product !== "NumNum Bento" && (
                            <Box sx={{pt: 2, width: 200, textAlign: "center"}}>
                                <FormControlLabel
                                    control={<Switch
                                        id="config-can_trackpad_layer"
                                        onChange={handleChange("can_trackpad_layer", device.id)}
                                        checked={device.config.can_trackpad_layer === 1}
                                    />}
                                    labelPlacement="top"
                                    label="TrackPad Layer"/>
                            </Box>
                        )}
                    </Box>
                    <Divider sx={{pt: 1, pb: 1, width: '100%'}}/>
                </Box>
            )}
        </Box>
    )
})

export default SettingEdit