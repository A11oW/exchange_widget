import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import formatNumber from '../../utils/formatNumber';
import { Box, Label, PocketCount, Value } from './FieldGroup.styles';

@observer
class FieldGroup extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    currency: PropTypes.shape({
      value: PropTypes.string.isRequired,
      format: PropTypes.string.isRequired,
    }).isRequired,
    pocket: PropTypes.shape({
      format: PropTypes.func.isRequired,
    }).isRequired,
    prefix: PropTypes.string,
    pristine: PropTypes.number,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  onChangeValue = (e) => {
    const { currency, pristine, pocket } = this.props;
    let value = formatNumber(e.target.value, pristine);

    if (Number(value) > Number(pocket.value)) {
      value = pocket.value;
    }

    if (value !== currency.value) {
      this.props.onChange(value);
    }
  };

  onFocus = () => this.props.onFocus();

  render() {
    const { label, currency, prefix, pocket } = this.props;
    const valueWithPrefix = currency.value && currency.value.toString().length
      ? (prefix + currency.format)
      : '';
    const fontSize = 3 - (valueWithPrefix.length * 0.06);

    return (
      <Box>
        <Label>{label}</Label>
        <Value
          autoComplete="off"
          type="text"
          maxLength="12"
          id={`${prefix}${label}`}
          value={valueWithPrefix}
          fontsize={fontSize}
          onChange={this.onChangeValue}
          onFocus={this.onFocus}
        />
        <PocketCount>You have {pocket.format()}</PocketCount>
      </Box>
    );
  }
}

export default FieldGroup;
