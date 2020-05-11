import { combineReducers } from 'redux'
import sessionReducer from './index'

const rootReducer = combineReducers({
    sessionState: sessionReducer
})

export default rootReducer