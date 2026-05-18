import { createSlice } from '@reduxjs/toolkit';
import { call, put, takeLatest, select } from 'redux-saga/effects';

export function createSagaSlice({ name, initialState, reducers = {}, asyncReducers = {} }) {
  const generatedReducers = { ...reducers };
  const watchers = [];

  Object.entries(asyncReducers).forEach(([actionName, config]) => {
    const requestName = actionName;
    const successName = `${actionName}Success`;
    const failureName = `${actionName}Failure`;
    const loadingKey = config.loadingKey || 'loading';
    const errorKey = config.errorKey || 'error';

    generatedReducers[requestName] = (state) => {
      state[loadingKey] = true;
      state[errorKey] = null;
      if (config.onRequest) config.onRequest(state);
    };

    generatedReducers[successName] = (state, action) => {
      state[loadingKey] = false;
      if (config.onSuccess) config.onSuccess(state, action);
    };

    generatedReducers[failureName] = (state, action) => {
      state[loadingKey] = false;
      const errorMessage = typeof action.payload === 'string' ? action.payload : (action.payload?.message || 'Произошла ошибка');
      state[errorKey] = errorMessage;
      if (config.onFailure) config.onFailure(state, action);
    };

    watchers.push({ actionName, successName, failureName, handler: config.handler });
  });

  const slice = createSlice({ name, initialState, reducers: generatedReducers });

  function* saga() {
    for (const { actionName, successName, failureName, handler } of watchers) {
      yield takeLatest(slice.actions[actionName].type, function* worker(action) {
        try {
          const state = yield select();
          const result = yield call(handler, action.payload, state);
          yield put(slice.actions[successName](result));
          if (action.payload?.onSuccess) yield call(action.payload.onSuccess, result);
        } catch (err) {
          console.error(`Error in ${actionName}:`, err);
          const errorMessage = err?.response?.data?.error || err?.message || err || 'Произошла ошибка';
          yield put(slice.actions[failureName](errorMessage));
          if (action.payload?.onError) yield call(action.payload.onError, errorMessage);
        }
      });
    }
  }

  const actionTypes = Object.keys(asyncReducers).reduce((types, actionName) => {
    types[actionName] = {
      request: slice.actions[actionName].type,
      success: slice.actions[`${actionName}Success`].type,
      failure: slice.actions[`${actionName}Failure`].type,
    };
    return types;
  }, {});

  return { reducer: slice.reducer, actions: slice.actions, saga, actionTypes };
}

export default createSagaSlice;