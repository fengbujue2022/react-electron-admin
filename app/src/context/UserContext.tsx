import React, { useCallback } from 'react'
import AV from 'leancloud-storage/live-query'
import { StorageKey } from '@/src/constants/storeageKey'

type User = { username: string }
type UserActionType = 'LOGIN_SUCCESS' | 'SIGN_OUT_SUCCESS' | 'LOGIN_FAILURE'
type UserState = { user?: User }
type UserActionGeneric<T extends UserActionType> = T extends 'LOGIN_SUCCESS'
  ? { type: T; user: User }
  : { type: T }
type UserAction = UserActionGeneric<UserActionType>

const UserStateContext = React.createContext<UserState>(undefined!)
const UserDispatchContext = React.createContext<React.Dispatch<UserAction>>(undefined!)

function userReducer(state: UserState, action: UserAction) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem(StorageKey.User, JSON.stringify(action.user))
      return { ...state, user: action?.user }
    case 'SIGN_OUT_SUCCESS':
      localStorage.removeItem(StorageKey.User)
      return { ...state, user: undefined }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const UserProvider: React.FC = ({ children }) => {
  const userJson = localStorage.getItem(StorageKey.User)
  const [state, dispatch] = React.useReducer(userReducer, {
    user: userJson ? (JSON.parse(userJson) as User) : undefined,
  })
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>{children}</UserDispatchContext.Provider>
    </UserStateContext.Provider>
  )
}

function useUserState() {
  const context = React.useContext(UserStateContext)
  if (context === undefined) {
    throw new Error('useUserState must be used within a UserProvider')
  }
  return context
}

function useUserDispatch() {
  const context = React.useContext(UserDispatchContext)
  if (context === undefined) {
    throw new Error('useUserDispatch must be used within a UserProvider')
  }
  return context
}

export { UserProvider, useUserState, useUserDispatch, useAuthenticationAction }

function useAuthenticationAction() {
  const dispatch = useUserDispatch()

  const login = useCallback(
    async (username: string, password: string) => {
      const user = await AV.User.logIn(username, password)
      if (user) {
        dispatch({ type: 'LOGIN_SUCCESS', user: { username: user.getUsername() } })
      } else {
        dispatch({ type: 'LOGIN_FAILURE' })
      }
      return user
    },
    [dispatch]
  )

  const logout = useCallback(async () => {
    await AV.User.logOut()
    dispatch({ type: 'SIGN_OUT_SUCCESS' })
  }, [dispatch])

  return { login, logout }
}
