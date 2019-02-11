import { observable } from 'mobx';

// TODO replace money.js to Fx
export default class Fx {
  @observable base = null;
  @observable timestamp = 0;
  @observable rates = {};

  convert(val, { from, to } = {}) {
    // We need to know the `from` and `to` currencies
    if (!from) {
      throw new Error('Argument "from" must be not empty');
    }
    if (!to) {
      throw new Error('Argument "to" must be not empty');
    }

    // Multiple the value by the exchange rate
    return val * this.getRate(to, from);
  }

  // Returns the exchange rate to `target` currency from `base` currency
  getRate(to, from) {
    const rates = this.rates;

    if (!rates || !Object.keys(rates).length) {
      throw new Error('Empty rates');
    }

    if (!this.base || !rates[this.base]) {
      throw new Error('Empty base currency');
    }

    // Throw an error if either rate isn't in the rates array
    if (!rates[to] || !rates[from]) throw new Error('fx error');

    // Make sure the base rate is in the rates object:
    rates[this.base] = 1;

    // If `from` currency === fx.base, return the basic exchange rate for the `to` currency
    if (from === this.base) {
      return rates[to];
    }

    // If `to` currency === fx.base, return the basic inverse rate of the `from` currency
    if (to === this.base) {
      return 1 / rates[from];
    }

    // Otherwise, return the `to` rate multipled by the inverse of the `from` rate to get the
    // relative exchange rate between the two currencies
    return rates[to] * (1 / rates[from]);
  }
}
