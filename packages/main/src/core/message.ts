import * as actions from '@/actions';
import { ActionData } from '@/types';
import { ipcMain, WebContents } from 'electron';

function finishWithResult(
  sender: WebContents,
  event_name: string,
  data: [any] | [any, any]
) {
  try {
    sender.send(event_name, ...data);
  } catch (e) {
    console.error(e);
  }
}

ipcMain.on('x_action', async (e, action_data: ActionData) => {
  let sender = e.sender;
  let { action, data, callbackId } = action_data;

  let fn = actions[action];
  if (typeof fn === 'function') {
    let params = data || [];
    if (!Array.isArray(params)) {
      params = [params];
    }

    try {
      // @ts-ignore
      let v = await fn(...params);
      finishWithResult(sender, callbackId, [null, v]);
    } catch (e) {
      console.error(e);
      finishWithResult(sender, callbackId, [e]);
    }
  } else {
    let e = `unknow action [${action}].`;
    console.error(e);
    finishWithResult(sender, callbackId, [e]);
  }
});
