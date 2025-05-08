import AppReducer, { type State } from "./app/reducer";

import type { Reducer } from "@reduxjs/toolkit";

const reducers: { app: Reducer<State> } = {
	app: AppReducer,
};

export default reducers;
