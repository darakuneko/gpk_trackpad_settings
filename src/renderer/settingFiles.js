import React from "react";
import {Button, Box} from "@mui/material";
import {theme} from "../style";
const {api} = window

const SettingFiles = (() => {
    const handleImport= async (event) => await api.importFile()
    const handleExport = async (event) => await api.exportFile()

    return (
        <Box sx={{pt: 1, pl: 4,color: theme.palette.primary.main}}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                maxWidth: '260px'
            }}>
                <Button
                variant="contained"
                onClick={handleImport}
                sx={{width: '120px'}}
                >Import</Button>
                <Button
                variant="contained"
                onClick={handleExport}
                sx={{width: '120px'}}
                >Export</Button>
            </Box>
        </Box>)
})

export default SettingFiles