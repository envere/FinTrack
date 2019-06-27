const initialState = [];
const portfolio = (state = initialState, action) => {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        {
          symbol: action.symbol,
          startPrice: action.startPrice,
          currPrice: action.currPrice
        }
      ];
    default:
      return state;
  }
};

export default portfolio;
