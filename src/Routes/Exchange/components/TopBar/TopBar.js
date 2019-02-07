import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';

import { Box, Link, Rates } from './TopBar.styles';

const Fraction = ({ fraction }) => {
  if (fraction) {
    return (
      <Fragment>
        .{fraction.substr(0, 2)}
        <small>{fraction.substr(2, 2)}</small>
      </Fragment>
    );
  }

  return null;
};

const Rate = ({ rate }) => {
  const int = parseInt(rate);
  const fraction = rate.toString().split('.')[1];

  return (
    <Fragment>
      {int}
      <Fraction fraction={fraction} />
    </Fragment>
  );
};

const TopBar = inject('store')(
  observer(({ store }) => {
    const rate = store.currencyRate;
    const from = `${store.currencySymbol[store.fromCurrency.currency]}1`;
    const to = (
      <Fragment>
        {store.currencySymbol[store.inCurrency.currency]}
        <Rate rate={rate} />
      </Fragment>
    );

    return (
      <Box>
        <Link isLeft={true} to="/">
          Back
        </Link>
        <Rates>
          {from} = {to}
        </Rates>
        <Link isRight={true} to="/" onClick={() => store.setExchange()}>
          Exchange
        </Link>
      </Box>
    );
  })
);

export default TopBar;
