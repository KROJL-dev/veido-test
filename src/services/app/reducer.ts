import companies from '../../mock/companies.json';

const initialState = {
  companies,
};

export default function (state = initialState, { type }) {
  switch (type) {
    default:
      return state;
  }
}
