import thunk from 'redux-thunk';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
// Dynamic loading of reducers


function composeReducers(reducers = {}) {
    return combineReducers({ ...reducers });
}

// middleware
// ----------------------------------------------------------------------------
const middleware = [thunk, createLogger({
    collapsed: () => true,
  })];
const composeEnhancers = composeWithDevTools;

// store
// ----------------------------------------------------------------------------
function createReduxStore(reducers) {
  const rootReducer = composeReducers(reducers);
  const enhancedMiddlewares = composeEnhancers(applyMiddleware(...middleware));
  const store = createStore(rootReducer, enhancedMiddlewares);
  return store;
}

export default createReduxStore;
