import './index.css';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import makeInspectable from 'mobx-devtools-mst';

import App from './App';
import ExchangeModel from './models/ExchangeModel';

const store = new ExchangeModel();
store.runFetchRates();

makeInspectable(store);

render(
  <Provider store={store}>
    <App />
  </Provider>, document.querySelector('#app'));
