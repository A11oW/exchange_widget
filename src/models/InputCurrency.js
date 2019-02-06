const uuidv4 = require('uuid/v4');
import { observable, action, computed } from 'mobx';

import formatNumber from '../utils/formatNumber';

export default class InputCurrency {
  @observable id = uuidv4();
  @observable currency;
  @observable value;

  constructor(currency, value = "") {
    this.currency = currency;
    this.value = value;
  }

  @action setValue(value) {
    this.value = value;
  }

  @computed get format() {
    return formatNumber(this.value);
  }
}
