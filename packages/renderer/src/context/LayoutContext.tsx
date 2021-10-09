import React from 'react'

type LayoutState = { isSidebarOpened: boolean }
type LayoutAction = { type: 'TOGGLE_SIDEBAR' }

const LayoutStateContext = React.createContext<LayoutState>(undefined!)
const LayoutDispatchContext = React.createContext<React.Dispatch<LayoutAction>>(undefined!)

function layoutReducer(state: LayoutState, action: LayoutAction) {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpened: !state.isSidebarOpened }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const LayoutProvider: React.FC = function ({ children }) {
  const [state, dispatch] = React.useReducer(layoutReducer, {
    isSidebarOpened: true,
  })
  return (
    <LayoutStateContext.Provider value={state}>
      <LayoutDispatchContext.Provider value={dispatch}>{children}</LayoutDispatchContext.Provider>
    </LayoutStateContext.Provider>
  )
}

function useLayoutState() {
  const context = React.useContext(LayoutStateContext)
  if (context === undefined) {
    throw new Error('useLayoutState must be used within a LayoutProvider')
  }
  return context
}

function useLayoutDispatch() {
  const context = React.useContext(LayoutDispatchContext)
  if (context === undefined) {
    throw new Error('useLayoutDispatch must be used within a LayoutProvider')
  }
  return context
}

function toggleSidebar(dispatch: React.Dispatch<LayoutAction>) {
  dispatch({
    type: 'TOGGLE_SIDEBAR',
  })
}
export { LayoutProvider, useLayoutState, useLayoutDispatch, toggleSidebar }
