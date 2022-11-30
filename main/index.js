// Native
const { join } = require('path');
const { format } = require('url');

// Packages
const { BrowserWindow, app, ipcMain, globalShortcut } = require('electron');
const JSONdb = require('simple-json-db');

const isDev = require('electron-is-dev');
const prepareNext = require('electron-next');
const shelljs = require('shelljs');
const { readFileSync } = require('fs');

let mainWindow = null;

const db = new JSONdb(join(app.getPath('userData'), 'db.json'));

// Prepare the renderer once the app is ready
app.on('ready', async () => {
    if (isDev) {
        process.env.SETSUZOKU_DEV = true;
    } else {
        process.env.SETSUZOKU_DEV = false;
    };
    await db.set("servers", []);
    await db.delete("servers");
    await prepareNext('./renderer');

    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        minWidth: 900,
        minHeight: 800,
        webPreferences: {
            nodeIntegration: false,
            preload: join(__dirname, 'preload.js'),
            sandbox: false
        },
    });

    const url = isDev
    ? 'http://localhost:8000'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
    });

    mainWindow.loadURL(url)
});

app.on('browser-window-focus', function () {
    const url = isDev
    ? 'http://localhost:8000'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
    });

    globalShortcut.register("CommandOrControl+R", () => {
        if (mainWindow) {
            mainWindow?.loadURL(url);
        }
    });
    globalShortcut.register("F5", () => {
        if (mainWindow) {
            mainWindow?.loadURL(url);
        }
    });
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event, message) => {
    event.sender.send('message', message)
});

ipcMain.on("debug", (event, data) => {
    if (data.type === "openAppData") {
        require("electron").shell.openPath(app.getPath("userData"));
    };
});

ipcMain.on("router", (event, data) => {
    const url = isDev
    ? 'http://localhost:8000'
    : format({
        pathname: join(__dirname, '../renderer/out/'),
        protocol: 'file:',
        slashes: true,
    });

    if (mainWindow === null) {
        return event.sender.send("router", {
            type: "router",
            payload: {
                success: false,
                error: "Main window is nil, not initialized"
            }
        });
    };

    if (data.type === "push") {
        // Reject if path not relative
        if (data.path.startsWith("file://")) {
            return event.sender.send("router", {
                type: "push",
                payload: {
                    success: false,
                    error: "Path must be relative"
                }
            });
        };

        if (mainWindow) {
            mainWindow?.loadURL(url + data.path);
            return event.sender.send("router", {
                type: "push",
                payload: {
                    success: true
                }
            });
        }
    };
});

ipcMain.on("listing", async (event, message) => {
    switch (message.type) {
        case "create":
            const existing = db.has(message.payload?.host);
            if (existing) return event.sender.send("listing", { type: "create", payload: { host: message.payload?.host, success: false, error: "Listing already exists" } });
            else {
                db.set(message.payload?.host, message.payload);
                return event.sender.send("listing", { type: "create", payload: { host: message.payload?.host, success: true } });
            };
            break;

        case "list":
            const data = Object.keys(db.JSON()).map(key => db.get(key));
            return event.sender.send("listing", { type: "list", payload: data });
            break;

        case "connect":
            const listing = db.get(message.payload?.host);
            if (!listing) return event.sender.send("listing", { type: "connect", payload: { host: message.payload?.host, success: false, status: "failed", error: "Listing does not exist" } });
            else {
                event.sender.send("listing", { type: "connect", payload: { host: listing.host, displayName: listing.displayName, success: true, status: "connected" } });
                const sshprocess = await shelljs.exec(`start ssh ${listing.username}@${listing.host} -p ${listing.port} ${listing.auth.method === "key" ? `-i ${listing.auth.auth}` : ""}`, (code, stdout, stderr) => {
                    if (code === 0) {
                        return event.sender.send("listing", { type: "connect", payload: { host: listing.host, displayName: listing.displayName, success: true, status: "disconnected" } });
                    } else {
                        return event.sender.send("listing", { type: "connect", payload: { host: listing.host, displayName: listing.displayName, success: false, status: "failed", error: stderr } });
                    };
                });
            };
            break;
        
        case "remove":
            const listingExists = db.has(message.payload?.host);
            if (!listingExists) return event.sender.send("listing", { type: "remove", payload: { host: message.payload?.host, success: false, error: "Listing does not exist" } });
            else {
                db.delete(message.payload?.host);
                return event.sender.send("listing", { type: "remove", payload: { host: message.payload?.host, success: true } });
            };
            break;
        
        default:
            break;
    };
});