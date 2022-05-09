
export default function nativeFactory (name, config) {
    return config.reduce((acc, item) => {
        return {
            ...acc,
            [item]: function () {
                return window.electron.ipcRenderer.sendMessage(name, [item, ...arguments]);
            }
        }
    }, {});
}