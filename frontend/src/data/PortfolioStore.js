import { createStore } from "redux";

import portfolio from "./reducers/Portfolio";

const store = createStore(portfolio);

export default store;
