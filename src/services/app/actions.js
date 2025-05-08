export const FAVORITE_COMPANIES_SELECT_FILTER =
	"favorite_companies_select.filter";

export function getFavoriteCompanies() {
	return function () {
		const ids = JSON.parse(
			localStorage.getItem(FAVORITE_COMPANIES_SELECT_FILTER),
		);
		if (!ids || !ids.length) {
			return [];
		}
		return ids;
	};
}
export function setFavoriteCompanies(data) {
	return function () {
		localStorage.setItem(
			FAVORITE_COMPANIES_SELECT_FILTER,
			JSON.stringify(data),
		);
		return "someAction";
	};
}
