const initialState = {
  stockList: [],
  transactions: []
};
const portfolio = (state = initialState, action) => {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        stockList: [
          ...state.stockList,
          {
            symbol: action.symbol,
            name: action.name,
            startPrice: action.startPrice,
            currPrice: action.currPrice
          }
        ],
        transactions: [
          ...state.transactions,
          {
            symbol: action.symbol,
            price: action.startPrice,
            date: action.date
          }
        ]
      };

    default:
      return state;
  }
};

export default portfolio;
