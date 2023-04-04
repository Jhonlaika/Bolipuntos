import { configureStore } from '@reduxjs/toolkit';
import scoreReducer from './features/score/reducers';

export const store = configureStore({
    reducer: {
      score:scoreReducer
    },
  })
  
  export default store;