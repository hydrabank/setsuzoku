const { ipcRenderer, contextBridge } = require('electron');
const { format } = require('url');
const { join } = require('path');

const windowLoaded = new Promise(resolve => {
    window.onload = resolve
});

const windowBaseURL = new Promise(async resolve => {
    await windowLoaded;
    resolve(window.location.href);
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
    },
    router: {
        push: async (url) => {
            if (url.startsWith("file://")) {
                throw new Error("Path must be relative");
            };

            if (url === "/") {
                url = "/index.html";
            }

            ipcRenderer.send("router", { type: "push", path: url });

            return new Promise(resolve => {
                ipcRenderer.once("router", (event, message) => {
                    if (message.type === "push") {
                        resolve(message?.payload);
                    };
                });
            });
        }
    },
    rootPath: process.env.SETSUZOKU_DEV === "true" ? "http://localhost:8000" : format({
        pathname: join(__dirname, '../renderer/out'),
        protocol: 'file:',
        slashes: true,
    })
});

ipcRenderer.on("listing", async (event, data) => {
    await windowLoaded;
    window.postMessage(data, "*");
});

ipcRenderer.on("router", async (event, data) => {
    await windowLoaded;
    window.postMessage(data, "*");
});