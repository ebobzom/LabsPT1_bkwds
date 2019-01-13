import axios from "axios"
import { SERVER_URI } from "../../config"
import {
  INIT_NEW_SUBSCRIPTION,
  SUBSCRIBE_SUCCESS,
  SUBSCRIBE_FAIL,
  INIT_NEW_CANCELLATION,
  CANCEL_SUBSCRIPTION_SUCCESS,
  CANCEL_SUBSCRIPTION_FAIL,
  QUERYING_USER_BY_TOKEN_SUCCESS
} from "./types"
import { updateUserInStore } from "./auth"
import { STRIPE_PLAN_ID_TEST } from "../../config"

const token = localStorage.getItem("token")
if (token) {
  // If token, set token as Authorization header on all requests:
  axios.defaults.headers.common["Authorization"] = token
}

export const cancelSubscription = ({ id, subscribeId }) => async dispatch => {
  dispatch({ type: INIT_NEW_CANCELLATION })

  if (!token) return

  const result = await axios.post(`${SERVER_URI}/subscribe/cancel/${id}`, {
    subscribeId
  })
  if (result && result.data) {
    dispatch({ type: CANCEL_SUBSCRIPTION_SUCCESS, payload: result.data })
    dispatch({ type: QUERYING_USER_BY_TOKEN_SUCCESS, payload: result.data })
  } else {
    dispatch({ type: CANCEL_SUBSCRIPTION_FAIL, payload: result.error })
  }
}

export const subscribe = ({ id, owner, stripe }) => async dispatch => {
  dispatch({ type: INIT_NEW_SUBSCRIPTION })

  if (!token) return

  const { source } = await stripe.createSource({ type: "card" })
  const updatedSource = { ...source, owner }
  const newSubscription = await axios.post(`${SERVER_URI}/subscribe/${id}`, {
    // TODO: Remove STRIPE_PLAN_ID_TEST out soon so things don't break in production, where it will not be defined
    planId: STRIPE_PLAN_ID_TEST,
    source: updatedSource
  })
  // Does POST return an empty object on fail? If so, we will never reach the else clause:
  if (newSubscription) {
    dispatch({ type: SUBSCRIBE_SUCCESS, payload: newSubscription.data })
    // TODO: Consider housing subscription information on billing reducer instead of user?
    dispatch(updateUserInStore(newSubscription.data))
  } else {
    dispatch({ type: SUBSCRIBE_FAIL, payload: newSubscription.error })
  }
}