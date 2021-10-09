import { Actions } from '../types';

const globalThis = window as any;

export const actions: Actions = new Proxy(
  {},
  {
    get(obj, key: keyof Actions) {
      return (...params: any[]) => globalThis._agent.call(key, ...params);
    },
  }
) as Actions;

export const agent = globalThis._agent;
