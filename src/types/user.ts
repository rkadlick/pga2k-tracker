import { BaseRecord } from './base'

/**
 * A user account record as returned by the API.
 */
export interface User extends BaseRecord {
  email: string
}

/**
 * Shape of your auth+user slice in Redux / Context / zustand, etc.
 */
export interface UserState {
  isAuthenticated: boolean
  user?: User
  loading: boolean
}
