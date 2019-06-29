const initialState = [
  [], //stocklist
  [] //transaction history
];
const portfolio = (state = initialState, action) => {
  switch (action.type) {
    case "ADD":
      return [
        [
          //stocklist
          ...state, // existing stocks
          {
            symbol: action.symbol,
            name: action.name,
            startPrice: action.startPrice,
            currPrice: action.currPrice
          }
        ],
        [
          //transaction history
          ...state, // existing transactions
          {
            symbol: action.symbol,
            price: action.startPrice,
            date: action.date
          }
        ]
      ];
    default:
      return state;
  }
};

export default portfolio;
