import { configureStore } from '@reduxjs/toolkit';

import reducers from './services/reducers';

const store = configureStore({
  reducer: reducers,
});

export default store;
