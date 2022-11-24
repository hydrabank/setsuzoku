import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("electron", {
    test: () => {
        console.log("test");
    }
});