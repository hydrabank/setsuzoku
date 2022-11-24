const { ipcRenderer, contextBridge } = require('electron');

const windowLoaded = new Promise(resolve => {
    window.onload = resolve
});

contextBridge.exposeInMainWorld('electron', {
    message: {
        send: (payload) => ipcRenderer.send('message', payload),
        on: (handler) => ipcRenderer.on('message', handler),
        off: (handler) => ipcRenderer.off('message', handler),
    },
});

contextBridge.exposeInMainWorld("setsuzoku", {
    listing: {
        create: ({ displayName, host, port, username, auth }) => {
            if (!displayName || !host || !username || !auth) {
                throw new Error(`Expecting all fields not nil, received: ${JSON.stringify({ displayName, host, username })}`);
            };

            if (auth.method === "key" && !auth.auth) {
                throw new Error(`auth.method == key expects that auth.auth not nil, received: ${JSON.stringify({ auth })}`);
            };

            ipcRenderer.send("listing", { 
                type: "create", 
                payload: {
                    displayName, host, port, username, auth
                }
            });
        },
        list: async () => {
            ipcRenderer.send("listing", { type: "list" });

            return new Promise(resolve => {
                ipcRenderer.once("listing", (event, message) => {
                    if (message.type === "list") {
                        resolve(message.payload);
                    };
                });
            });
        },
        connect: async (host) => {
            ipcRenderer.send("listing", { type: "connect", payload: { host } });

            return new Promise(resolve => {
                ipcRenderer.once("listing", (event, message) => {
                    if (message.type === "connect") {
                        resolve(message.payload);
                    };
                });
            });
        },
        remove: async (host) => {
            ipcRenderer.send("listing", { type: "remove", payload: { host } });

            return new Promise(resolve => {
                ipcRenderer.once("listing", (event, message) => {
                    if (message.type === "remove") {
                        resolve(message.payload);
                    };
                });
            });
        }
    },
    debug: {
        openAppData: () => ipcRenderer.send("debug", { type: "openAppData" })
    }
});

ipcRenderer.on("listing", async (event, data) => {
    await windowLoaded;
    window.postMessage(data, "*");
});