import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import auth from './auth'
import symbolsReducer from './symbols'
import portfolioReducer from './portfolio'
import analysisReducer from './analysis'

const reducer = combineReducers({
  auth,
  symbols: symbolsReducer,
  portfolio: portfolioReducer,
  dataTable: analysisReducer
})

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)

const store = createStore(reducer, middleware)

export default store
export * from './auth'
