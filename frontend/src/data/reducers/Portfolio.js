const initialState = {
  stockList: [],
  transactions: []
};
const portfolio = (state = initialState, action) => {
  switch (action.type) {
    case "TRANSACTIONS":
      return {
        ...state,
        transactions: action.history.sort((stock1, stock2) => {
          if (stock2.date > stock1.date) {
            return 1;
          } else if (stock2.date < stock1.date) {
            return -1;
          } else {
            return 0;
          }
        })
      };
    case "PORTFOLIO":
      return {
        ...state,
        stockList: action.portfolio
      };
    default:
      return state;
  }
};

export default portfolio;
