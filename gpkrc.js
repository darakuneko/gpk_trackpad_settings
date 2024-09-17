const HID = require('node-hid')
let connectKbd = {}
let kbd = {}

const PACKET_PADDING = 64

const dataToBytes = (data) =>
    typeof data === 'string' ? [...data].map(c => c.charCodeAt(0)).concat(0) : data

const commandToBytes = ({ id, data }) => {
    const bytes = data ? dataToBytes(data) : []
    const unpadded = [0, id, ...bytes]
    const padding = Array(PACKET_PADDING - (unpadded.length % PACKET_PADDING)).fill(0)
    return unpadded.concat(padding)
}

const DEFAULT_USAGE = {
    usage: 0x61,
    usagePage: 0xFF60
}

const deviceId = (device) => `${device.manufacturer}-${device.product}-${device.vendorId}-${device.productId}`

const getKBD = (device) => HID.devices().find(d =>
    (device ?
        (d.manufacturer === device.manufacturer &&
            d.product === device.product &&
            d.vendorId === device.vendorId &&
            d.productId === device.productId) : false) &&
    d.usage === DEFAULT_USAGE.usage &&
    d.usagePage === DEFAULT_USAGE.usagePage
)

const getKBDList = () => HID.devices().filter(d =>
    d.usage === DEFAULT_USAGE.usage &&
    d.usagePage === DEFAULT_USAGE.usagePage
).sort((a, b) => `${a.manufacturer}${a.product}` > `${b.manufacturer}${b.product}` ? 1 : -1)

function joinScrollTerm(a, b) {
    const lower6Bits = a & 0b00111111
    const upper4Bits = (b & 0b11110000) >> 4
    return (lower6Bits << 4) | upper4Bits
}

function joinDragTerm(a, b) {
    const lower4Bits = a & 0b00001111
    const upper6Bits = (b & 0b11111100) >> 2
    return (lower4Bits << 6) | upper6Bits
}

function joinDefaultSpeed(a, b) {
    const lower2Bits = a & 0b00000011
    const upper4Bits = (b & 0b11110000) >> 4
    return (lower2Bits << 4) | upper4Bits
}

function receiveTrackpadConfig(data) {
    return {
        init: data[6] & 0b00000001,
        hf_waveform_number: (data[6] & 0b11111110) >> 1,
        can_hf_for_layer: (data[7] & 0b10000000) >> 7,
        can_drag: (data[7] & 0b01000000) >> 6,
        scroll_term: joinScrollTerm(data[7], data[8]),
        drag_term: joinDragTerm(data[8], data[9]),
        can_trackpad_layer: (data[9] & 0b00000010) >> 1,
        can_reverse_scrolling_direction: data[9] & 0b00000001,
        drag_strength_mode: (data[10] & 0b10000000) >> 7,
        drag_strength: (data[10] & 0b01111100) >> 2,
        default_speed: joinDefaultSpeed(data[10], data[11]),
        scroll_step: data[11] & 0b00001111,
        can_short_scroll: (data[12] & 0b10000000) >> 7
    }
}

const start = async (device, os) => {
    const d = getKBD(device)
    if (d && d.path) {
        const id = deviceId(device)
        if(!kbd[id]){
            kbd[id] = new HID.HID(d.path)
            connectKbd[id] = {
                config: {},
                connected: true,
            }
            kbd[id].on('error', (err) => {
                console.error(`${err}`)
                stop(device)
            })
            kbd[id].on('data', buffer => {
                const identifier = buffer.slice(0, 6).toString()
                if(identifier === "gpktps") connectKbd[id].config = receiveTrackpadConfig(buffer)
            })
        }
    }
}

const stop = (device) => {
    const id = deviceId(device)
    if (kbd[id]) {
        kbd[id].removeAllListeners("data")
        _close(id)
        kbd[id] = undefined
        connectKbd[id] = undefined
    }
}

const _close = (id) => {
    try{
        kbd[id].close()
    } catch (e) {
        console.log(`close ${e}`)
    }
}

const close = () => {
    if(kbd) Object.keys(kbd).map(id => _close(id))
}

const writeCommand = async (device, command) => {
    const id = deviceId(device)
    if (kbd[id]) await kbd[id].write(commandToBytes(command))
}

module.exports.getConnectKbd = (id) => connectKbd[id]
module.exports.getKBD = getKBD
module.exports.getKBDList = getKBDList
module.exports.start = start
module.exports.stop = stop
module.exports.close = close
module.exports.writeCommand = writeCommand
module.exports.deviceId = deviceId