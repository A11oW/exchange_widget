import React from 'react';
import { inject, observer } from 'mobx-react';

import { BottomBar, Box, Button, Inner, Link, Сurrency, СurrencyWrap } from './CurrenciesList.styles';
import IconArrowRotate from '../../../../components/Icons/IconArrowRight';

@inject('store')
@observer
class CurrenciesList extends React.Component {
  render() {
    const { store } = this.props;

    return (
      <Box>
        <Inner>
          {Object.keys(store.pockets).map((currency, index, pockets) => {
            return (
              <СurrencyWrap
                key={currency}
                index={index}
                deg={((360) / (pockets.length)) * index}
              >
                <Сurrency>
                  {store.pockets[currency].format()}
                </Сurrency>
              </СurrencyWrap>
            );
          })}
        </Inner>
        <BottomBar>
          <Link to="/exchange">
            <Button>
              <IconArrowRotate />
            </Button>
            Exchange
          </Link>
        </BottomBar>
      </Box>
    );
  }
}

export default CurrenciesList;
