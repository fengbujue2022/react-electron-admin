import { BrowserWindow } from 'electron'
import * as actions from './actions'

export type Actions = typeof actions
export interface ActionData {
  action: keyof Actions
  data?: any
  callbackId: string
}

declare global {
  namespace NodeJS {
    interface Global {
      is_will_quit?: boolean
      main_win: BrowserWindow
    }
  }
}
