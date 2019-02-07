const uuidv4 = require('uuid/v4');
import { action, computed, observable } from 'mobx';

import formatNumber from '../utils/formatNumber';

export default class InputCurrencyModel {
  @observable id = uuidv4();
  @observable currency;
  @observable value;

  constructor(currency, value = '') {
    if (!currency) {
      throw new RangeError('Argument currency must be not empty');
    }

    this.currency = currency;
    this.value = value;
  }

  @action setCurrency(currency) {
    if (!currency) {
      throw new RangeError('Argument currency must be not empty');
    }

    this.currency = currency;
  }

  @action setValue(value) {
    if (!Number.isFinite(value) && typeof value !== 'string') {
      throw new RangeError('Argument currency must be string or number');
    }

    this.value = value.toString();
  }

  @computed get format() {
    return formatNumber(this.value).toString();
  }
}
