import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { Box, Point, Points, Slide, Swipe } from './InSlider.styles';
import FieldGroup from '../../../../components/FieldGroup/index';

@inject('store')
@observer
class OutSlider extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      inCurrency: PropTypes.shape(),
      currency: PropTypes.array,
    }).isRequired,
  };

  onChangeSlide = (index, elem) => {
    this.props.store.changeInCurrency(elem.dataset.currency);
  };

  onChangeValue = value => this.props.store.changeInValue(value);

  onFocusInput = () => {
    this.props.store.setFocusedInputCurrency("in");
  };

  render() {
    const { store } = this.props;
    const { inCurrency, pockets } = store;

    return (
      <Box>
        <Swipe
          swipeOptions={{
            continuous: true,
            startSlide: 1,
            callback: this.onChangeSlide,
          }}
          childCount={inCurrency.length}
        >
          {Object.entries(pockets).map(([currency], index) => (
            <Slide key={`slide-${currency}`} data-currency={currency}>
              <FieldGroup
                prefix="+"
                label={currency}
                pocket={pockets[currency]}
                currency={inCurrency}
                onChange={this.onChangeValue}
                onFocus={this.onFocusInput}
              />
            </Slide>
          ))}
        </Swipe>
        <Points>
          {
            Object.entries(pockets).map(([currency]) =>
              <Point key={`point-${currency}`} active={currency === inCurrency.currency} />)
          }
        </Points>
      </Box>
    );
  }
}

export default OutSlider;
