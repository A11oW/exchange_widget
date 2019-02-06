import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import OutSlider from './components/OutSlider/index';
import InSlider from './components/InSlider/index';
import TopBar from './components/TopBar';
import Error from '../../components/Error';
import Loader from '../../components/Loader';
import { Box, CurrencyBottom, CurrencyTop, Half, Link, LoaderCenter, Rates } from './Exchange.styles';
import { STATES } from '../../constants';

@inject('store')
@observer
class Exchange extends React.Component {
  static propTypes = {
    store: PropTypes.shape().isRequired,
  };

  componentWillMount() {
    this.props.store.enableReactionOnChangingRates();
  }

  componentWillUnmount() {
    this.props.store.disableReactionOnChangingRates();
  }

  render() {
    const { store } = this.props;

    if (store.fetchRatesState === STATES.FETCH_RATES__FAILURE) {
      return <Error />;
    }

    return (
      <Box>
        <Half>
          <CurrencyTop>
            <TopBar />
            <OutSlider />
          </CurrencyTop>
        </Half>
        <Half>
          <CurrencyBottom>
            <InSlider />
          </CurrencyBottom>
        </Half>
      </Box>
    );
  }
}

export default Exchange;
