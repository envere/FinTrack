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
    case "PORTFOLIO":
      return {
        ...state,
        stockList: action.portfolio
      }
    default:
      return state;
  }
};

export default portfolio;
