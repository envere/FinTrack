const initialState = {
  stockList: [],
  transactions: []
};
const portfolio = (state = initialState, action) => {
  switch (action.type) {
    case "TRANSACTIONS":
      return {
        ...state,
        transactions: action.history
      };

    default:
      return state;
  }
};

export default portfolio;
