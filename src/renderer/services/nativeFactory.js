
export function sendFactory (name, config) {
    return config.reduce((acc, item) => {
        return {
            ...acc,
            [item]: function () {
                return window.electron.ipcRenderer.sendMessage(name, [item, ...arguments]);
            }
        }
    }, {});
}
export function invokeFactory (name, config) {
    return config.reduce((acc, item) => {
        return {
            ...acc,
            [item]: function () {
                return window.electron.ipcRenderer.invoke(name, [item, ...arguments]);
            }
        }
    }, {});
}