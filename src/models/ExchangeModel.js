import { action, computed, observable, reaction } from 'mobx';
import remotedev from 'mobx-remotedev';
import fx from 'money';
import currency from 'currency.js';
import api from '../api';

import InputCurrencyModel from './InputCurrencyModel';
import {
  FETCH_RATES_ATTEMPTS,
  STATES,
  CURRENCY,
  CURRENCY_SYMBOLS,
} from '../constants';

@remotedev({ global: true })
class ExchangeModel {
  reactionOnChangingRates;

  @observable currency;
  @observable currencySymbol;

  @observable fetchRatesState;
  @observable fetchRatesCounter;

  @observable rates;
  @observable ratesTimestamp;

  @observable pockets = {};
  @observable fromCurrency;
  @observable inCurrency;
  @observable lastFocusedInputCurrency;

  @action changeFromCurrency(currencyName) {
    this.fromCurrency.setCurrency(currencyName);

    this.fromCurrency.setValue(0);
    this.inCurrency.setValue(0);
  }

  @action changeOutValue(value) {
    this.fromCurrency.setValue(value);

    if (this.fromCurrency.currency === this.inCurrency.currency) {
      this.inCurrency.setValue(value);
      return;
    }

    this.inCurrency.setValue(
      fx.convert(value, {
        from: this.fromCurrency.currency,
        to: this.inCurrency.currency,
      })
    );
  }

  @action changeInCurrency(currencyName) {
    this.inCurrency.setCurrency(currencyName);

    this.inCurrency.setValue(0);
    this.fromCurrency.setValue(0);
  }

  @action changeInValue(value) {
    this.inCurrency.setValue(value);

    if (this.inCurrency.currency === this.fromCurrency.currency) {
      this.fromCurrency.setValue(value);
      return;
    }

    this.fromCurrency.setValue(
      fx.convert(value, {
        from: this.inCurrency.currency,
        to: this.fromCurrency.currency,
      })
    );
  }

  /**
   * @param inputName "in" || "out"
   */
  @action setFocusedInputCurrency(inputName) {
    if (inputName === 'in') {
      this.lastFocusedInputCurrency = 'in';
    } else if (inputName === 'out') {
      this.lastFocusedInputCurrency = 'out';
    }
  }

  @computed get currencyRate() {
    return (
      this.rates[this.inCurrency.currency] /
      this.rates[this.fromCurrency.currency]
    );
  }

  enableReactionOnChangingRates() {
    if (this.reactionOnChangingRates) {
      return;
    }

    this.reactionOnChangingRates = reaction(
      () => this.rates,
      rates => {
        if (this.lastFocusedInputCurrency === 'in') {
          const value = this.inCurrency.value;

          this.fromCurrency.setValue(
            fx.convert(value, {
              from: this.inCurrency.currency,
              to: this.fromCurrency.currency,
            })
          );
        } else if (this.lastFocusedInputCurrency === 'out') {
          const value = this.fromCurrency.value;

          this.inCurrency.setValue(
            fx.convert(value, {
              from: this.fromCurrency.currency,
              to: this.inCurrency.currency,
            })
          );
        }
      }
    );
  }

  disableReactionOnChangingRates() {
    if (!this.reactionOnChangingRates) {
      return;
    }

    this.reactionOnChangingRates();
    this.reactionOnChangingRates = null;
  }

  fetchRates() {
    if (this.fetchRatesState === STATES.FETCH_RATES__PENDING) {
      return;
    }

    this.fetchRatesRequest();
  }

  @action
  fetchRatesRequest() {
    this.fetchRatesState = STATES.FETCH_RATES__PENDING;
    api.rates
      .getRates()
      .then(response => response.json())
      .then(data => this.fetchRatesSuccess(data))
      .catch(error => this.fetchRatesError(error));
  }

  @action
  fetchRatesSuccess(data) {
    this.rates = data.rates;

    try {
      const date = new Date(data.date).getTime();

      if (date < this.ratesTimestamp) {
        return;
      }

      this.ratesTimestamp = date;
    } catch (error) {
      throw new RangeError('Invalid rates date from server');
    }

    fx.base = data.base;
    fx.rates = this.rates;

    this.fetchRatesFailCounter = 0;
    this.fetchRatesState = STATES.FETCH_RATES__SUCCESS;
  }

  @action
  fetchRatesError() {
    // TODO differents logic from depending response codes (5xx, 4xx)
    // for example for 4xx don't retry request
    if (this.fetchRatesFailCounter === FETCH_RATES_ATTEMPTS - 1) {
      this.fetchRatesState = STATES.FETCH_RATES__FAILURE;
      this.fetchRatesFailCounter = 0;
      clearInterval(this.fetchRatesIntervalId);
      return;
    }

    this.fetchRatesFailCounter += 1;
    this.fetchRatesRequest();
  }

  @action
  runFetchRates() {
    this.fetchRates();

    this.fetchRatesIntervalId = setInterval(() => {
      this.fetchRates();
    }, 10000);
  }

  @action
  stopFetchRates() {
    clearInterval(this.fetchRatesIntervalId);
  }

  @action setExchange() {
    const fromCurrency = this.fromCurrency.currency;
    const inCurrency = this.inCurrency.currency;
    const fromValue = this.fromCurrency.value;
    const inValue = fx.convert(fromValue, {
      from: fromCurrency,
      to: inCurrency,
    });

    this.pockets[fromCurrency] = this.pockets[fromCurrency].subtract(fromValue);
    this.pockets[inCurrency] = this.pockets[inCurrency].add(inValue);
  }

  constructor() {
    this.rates = {};
    this.fetchRatesState = STATES.FETCH_RATES__INITIAL;
    this.ratesTimestamp = 0;
    this.fetchRatesFailCounter = 0;
    this.currency = CURRENCY;
    this.currencySymbol = CURRENCY_SYMBOLS;

    this.pockets.GBP = currency(58.33, {
      formatWithSymbol: true,
      symbol: this.currencySymbol.GBP,
    });
    this.pockets.EUR = currency(116.2, {
      formatWithSymbol: true,
      symbol: this.currencySymbol.EUR,
    });
    this.pockets.USD = currency(25.51, {
      formatWithSymbol: true,
      symbol: this.currencySymbol.USD,
    });

    this.fromCurrency = remotedev(new InputCurrencyModel(this.currency[0]), {
      name: 'fromCurrency',
    });
    this.inCurrency = remotedev(new InputCurrencyModel(this.currency[1]), {
      name: 'inCurrency',
    });
  }
}

export default ExchangeModel;
