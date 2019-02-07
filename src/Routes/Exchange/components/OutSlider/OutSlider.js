import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import {
  Box,
  Point,
  Points,
  Slide,
  Swipe,
} from '../../../../components/Slider';
import FieldGroup from '../../../../components/FieldGroup/index';

@inject('store')
@observer
class OutSlider extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      fromCurrency: PropTypes.shape(),
      currency: PropTypes.array,
    }).isRequired,
  };

  onChangeSlide = (index, elem) => {
    this.props.store.changeFromCurrency(elem.dataset.currency);
  };

  onChangeValue = value => this.props.store.changeOutValue(value);

  onFocusInput = () => {
    this.props.store.setFocusedInputCurrency('out');
  };

  render() {
    const { store } = this.props;
    const { fromCurrency, pockets } = store;

    return (
      <Box>
        <Swipe
          swipeOptions={{
            continuous: true,
            startSlide: 0,
            callback: this.onChangeSlide,
          }}
          childCount={fromCurrency.length}
        >
          {Object.entries(pockets).map(([currency]) => (
            <Slide key={`slide-${currency}`} data-currency={currency}>
              <FieldGroup
                prefix="-"
                label={currency}
                pocket={pockets[currency]}
                currency={fromCurrency}
                onChange={this.onChangeValue}
                onFocus={this.onFocusInput}
              />
            </Slide>
          ))}
        </Swipe>
        <Points>
          {Object.entries(pockets).map(([currency]) => (
            <Point
              key={`point-${currency}`}
              active={currency === fromCurrency.currency}
            />
          ))}
        </Points>
      </Box>
    );
  }
}

export default OutSlider;
