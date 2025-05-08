import companies from "../../mock/companies.json";

import type { Reducer } from "@reduxjs/toolkit";

export interface Company {
	id: number;
	name: string;
	phone_number: string | null;
	logo: string;
	type: "affiliate" | "contract";
	status: "active" | "inactive";
	users_count: number;
}

export type State = { companies: Company[] };
const initialState: State = {
	companies: companies as Company[],
};

const reducer: Reducer<State> = (state = initialState, action) => {
	switch (action.type) {
		default:
			return state;
	}
};
export default reducer;
