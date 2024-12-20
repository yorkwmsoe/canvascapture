import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const isTest = process.env.NODE_ENV === 'test'
if (isTest) {
    require('wdio-electron-service/preload')
}

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}
