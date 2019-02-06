import React from 'react';

import CurrencyList from './components/CurrenciesList';
import ExchnageHistoryList from './components/ExchnageHistoryList';

import { Box } from './Home.styles';

class Home extends React.Component {
  render() {
    return (
      <Box>
        <CurrencyList />
        <ExchnageHistoryList />
      </Box>
    );
  }
}

export default Home;
