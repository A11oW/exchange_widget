import React from 'react';
import DevTools from 'mobx-react-devtools';
import { inject, observer } from 'mobx-react';

import Routes from './Routes';
import { Box } from './App.styles';
import Loader from './components/Loader';
import Error from './components/Error';
import { STATES } from './constants';

const App = ({ store }) => {
  if (store.fetchRatesState === STATES.FETCH_RATES__FAILURE) {
    return (
      <Box>
        <Error />
      </Box>
    );
  }

  if (!Object.keys(store.fx.rates).length) {
    return (
      <Box>
        <Loader />
      </Box>
    );
  }

  const DOM = [<Routes key="routes" />];

  if (process.env.NODE_ENV === 'development') {
    // DOM.push(<DevTools key="devtools" />);
  }

  return DOM;
};

export default inject('store')(observer(App));
