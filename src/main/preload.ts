import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'import-project' | "get-projects" | "call-project-commands" | "project-commands-output" | "remove-project";

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke(channel: Channels, args: unknown[]): Promise<any> {
      return new Promise(async (resolve, reject) => {
        ipcRenderer.invoke(channel, args)
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});
