import { contextBridge, ipcRenderer } from 'electron';
import { EventEmitter } from 'events';
import * as action from './actions';
import { ActionData } from './types';

declare global {
  interface Window {
    _agent: typeof _agent;
  }
}

type Actions = typeof action;

export type EventHandler = (...args: any[]) => void;

const eventEmitter = new EventEmitter();

let x_action_get_idx = 0;

const callAction = (action: keyof Actions, ...params: any[]) => {
  const callbackId = ['_cb', new Date().getTime(), x_action_get_idx++].join(
    '_'
  );

  return new Promise((resolve, reject) => {
    ipcRenderer.send('x_action', {
      action,
      data: params,
      callbackId,
    } as ActionData);

    ipcRenderer.once(callbackId, (sender, err, d) => {
      if (err) {
        reject(err);
      } else {
        resolve(d);
      }
    });
  });
};

const on = (event: string, handler: EventHandler) => {
  eventEmitter.on(event, handler);
  return () => off(event, handler);
};

const once = (event: string, handler: EventHandler) => {
  eventEmitter.once(event, handler);
  return () => off(event, handler);
};

const off = (event: string, handler: EventHandler) => {
  // console.log(`off [${event}]`)
  eventEmitter.off(event, handler);
};

const _agent = {
  call: callAction,
  on,
  once,
  off,
  platform: process.platform,
};

contextBridge.exposeInMainWorld('_agent', _agent);
