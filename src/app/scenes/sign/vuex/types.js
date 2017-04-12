// scene name
const namespace = 'sign';

/**
 * Actions
 */
export const LOGIN_ATTEMPT = `${namespace}/SIGN_IN`
export const FETCH_USER = `${namespace}/FETCH_USER`
export const FORGOT_PASSWORD = `${namespace}/FORGOT_PASSWORD`

/**
 * Mutations
 */
export const TOKEN_RECEIVED = `${namespace}/STORE_TOKEN`
export const USER_RECEIVED = `${namespace}/STORE_USER`

/**
 * Getters
 */
export const GET_USER = `${namespace}/GET_USER`
export const IS_AUTH = `${namespace}/IS_AUTH`
