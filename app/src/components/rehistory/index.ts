import {
  History,
  Path,
  Action,
  Location,
  LocationState,
  UnregisterCallback,
  TransitionPromptHook,
  createHashHistory as originCreateHashHistory,
  HashHistoryBuildOptions,
} from 'history'

export const createHashRehistory = <T = LocationState>(options?: HashHistoryBuildOptions) => {
  const history = originCreateHashHistory(options)
  const rehistory = createRehistory(history)
  return new Proxy(history, {
    get: (target: History<T>, p: string | symbol, receiver: any) => {
      if (rehistory.hasOwnProperty(p)) {
        return rehistory[p]
      } else {
        return target[p]
      }
    },
  }) as Rehistory<T>
}

export type Reaction = 'push' | 'replace' | number
export type RelocationListener<S = LocationState> = (p: { location: Location<S>; action: Reaction }) => void
export type Rehistory<T = LocationState> = {
  relisten(listener: RelocationListener<T>): UnregisterCallback
  canGoback: () => boolean
  canForward: () => boolean
} & History<T>

const createRehistory = <HistoryLocationState = LocationState>(history: History<HistoryLocationState>) => {
  const listeners = createEvents<RelocationListener<HistoryLocationState>>()
  const blockers = createEvents<any>()
  let locationChain: Location[] = []
  let activeChainIndex = -1

  function allowTx(action: Action, location: Location, retry: () => void) {
    return !blockers.length || (blockers.call({ action, location, retry }), false)
  }

  const emptyRetry = () => {}
  const doRouteChange = (route: (isAllowTx: boolean) => Reaction) => {
    const isAllowTx = allowTx(history.action, history.location, emptyRetry)
    const action = route(isAllowTx)
    if (isAllowTx) {
      if (action === 'push') {
        locationChain = locationChain.splice(0, activeChainIndex + 1).concat([history.location])
        activeChainIndex += 1
      } else if (action === 'replace') {
        locationChain = locationChain.splice(0, activeChainIndex).concat([history.location])
      } else if (typeof action === 'number') {
        if (activeChainIndex > 0) {
          activeChainIndex += action
        }
      }
      listeners.call({ action, location: history.location })
    }
  }
  const go = (delta: number) => {
    doRouteChange(() => {
      history.go(delta)
      return delta
    })
  }

  return {
    // override
    push(path: Path, state?: HistoryLocationState) {
      doRouteChange(() => {
        history.push(path, state)
        return 'push'
      })
    },
    replace(path: Path, state?: HistoryLocationState) {
      doRouteChange(() => {
        history.replace(path, state)
        return 'replace'
      })
    },
    goBack() {
      go(-1)
    },
    goForward() {
      go(1)
    },
    go,
    block(blocker?: boolean | string | TransitionPromptHook<HistoryLocationState>): UnregisterCallback {
      let unblock = blockers.push(blocker)
      let originUnbloack = history.block(blocker)
      return function () {
        unblock()
        originUnbloack()
      }
    },
    // extra
    relisten(listener: RelocationListener<HistoryLocationState>) {
      return listeners.push(listener)
    },
    canGoback: () => {
      return activeChainIndex >= 0
    },
    canForward: () => {
      return activeChainIndex + 1 < locationChain.length
    },
  } as Rehistory<HistoryLocationState>
}

type Events<F> = {
  length: number
  push: (fn: F) => () => void
  call: (arg: any) => void
}

function createEvents<F extends Function>(): Events<F> {
  let handlers: F[] = []

  return {
    get length() {
      return handlers.length
    },
    push(fn: F) {
      handlers.push(fn)
      return function () {
        handlers = handlers.filter((handler) => handler !== fn)
      }
    },
    call(arg) {
      handlers.forEach((fn) => fn && fn(arg))
    },
  }
}
