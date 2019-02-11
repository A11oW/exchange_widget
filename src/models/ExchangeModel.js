import { action, computed, observable, reaction } from 'mobx';
import currency from 'currency.js';
import api from '../api';

import Fx from './Fx';

import InputCurrencyModel from './InputCurrencyModel';
import {
  CURRENCY,
  CURRENCY_SYMBOLS,
  FETCH_RATES_ATTEMPTS,
  STATES,
} from '../constants';

class ExchangeModel {
  reactionOnChangingRates;

  @observable currency;
  @observable currencySymbol;

  @observable fetchRatesState;
  @observable fetchRatesCounter;

  @observable rates;

  @observable pockets = {};
  @observable fromCurrency;
  @observable inCurrency;
  @observable lastFocusedInputCurrency;

  @action setFromCurrency(currencyName) {
    if (!this.currency.includes(currencyName)) {
      throw new Error(
        'Argument currencyName must be one of Model.currency list'
      );
    }

    this.fromCurrency.setCurrency(currencyName);

    this.fromCurrency.setValue('');
    this.inCurrency.setValue('');
  }

  @action setFromValue(value) {
    this.fromCurrency.setValue(value);

    if (this.fromCurrency.currency === this.inCurrency.currency) {
      this.inCurrency.setValue(value);
      return;
    }

    this.inCurrency.setValue(
      this.fx.convert(value, {
        from: this.fromCurrency.currency,
        to: this.inCurrency.currency,
      })
    );
  }

  @action setInCurrency(currencyName) {
    if (!this.currency.includes(currencyName)) {
      throw new Error(
        'Argument currencyName must be one of Model.currency list'
      );
    }

    this.inCurrency.setCurrency(currencyName);

    this.inCurrency.setValue('');
    this.fromCurrency.setValue('');
  }

  @action setInValue(value) {
    this.inCurrency.setValue(value);

    if (this.inCurrency.currency === this.fromCurrency.currency) {
      this.fromCurrency.setValue(value);
      return;
    }

    this.fromCurrency.setValue(
      this.fx.convert(value, {
        from: this.inCurrency.currency,
        to: this.fromCurrency.currency,
      })
    );
  }

  /**
   * @param inputName "in" || "out"
   */
  @action setFocusedInputCurrency(inputType) {
    switch (inputType) {
      case 'in':
        this.lastFocusedInputCurrency = 'in';
        break;
      case 'out':
        this.lastFocusedInputCurrency = 'out';
        break;
      default:
        throw new RangeError('Argument inputType must be "in" or "out" string');
    }
  }

  @computed get currencyRate() {
    return currency(this.fx.rates[this.inCurrency.currency], {
      precision: 4,
    }).divide(this.fx.rates[this.fromCurrency.currency]).value;
  }

  enableReactionOnChangingRates() {
    if (this.reactionOnChangingRates) {
      return;
    }

    this.reactionOnChangingRates = reaction(
      () => this.fx.rates,
      () => {
        if (this.lastFocusedInputCurrency === 'in') {
          const value = this.inCurrency.value;

          this.fromCurrency.setValue(
            this.fx.convert(value, {
              from: this.inCurrency.currency,
              to: this.fromCurrency.currency,
            })
          );
        } else if (this.lastFocusedInputCurrency === 'out') {
          const value = this.fromCurrency.value;

          this.inCurrency.setValue(
            this.fx.convert(value, {
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
  fetchRatesSuccess(payload) {
    this.setRates(payload);

    this.fetchRatesFailCounter = 0;
    this.fetchRatesState = STATES.FETCH_RATES__SUCCESS;
  }

  @action
  setRates(payload) {
    if (!payload) {
      throw new Error('Argument payload must be not empty');
    }

    const timestamp = new Date(payload.date).getTime();

    if (Number.isNaN(timestamp)) {
      throw new RangeError('Invalid rates date');
    }

    if (timestamp < this.fx.timestamp) {
      return;
    }

    this.fx.rates = payload.rates;
    this.fx.timestamp = timestamp;
    this.fx.base = payload.base;
    this.fx.rates = this.fx.rates;
  }

  @action
  fetchRatesError(error) {
    // TODO differents logic from depending response codes (5xx, 4xx)
    // for example for 4xx don't retry request
    if (error) {
      console.warn ? console.warn(error) : console.log(error);
    }

    if (this.fetchRatesFailCounter === FETCH_RATES_ATTEMPTS - 1) {
      this.fetchRatesState = STATES.FETCH_RATES__FAILURE;
      this.fetchRatesFailCounter = 0;

      clearInterval(this.fetchRatesIntervalId);
      this.fetchRatesIntervalId = null;
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
    this.fetchRatesIntervalId = null;
  }

  @action setExchange() {
    const fromCurrency = this.fromCurrency.currency;
    const inCurrency = this.inCurrency.currency;
    const fromValue = this.fromCurrency.value;
    const inValue = this.fx.convert(fromValue, {
      from: fromCurrency,
      to: inCurrency,
    });

    this.fromCurrency.setValue(0);
    this.inCurrency.setValue(0);
    this.pockets[fromCurrency] = this.pockets[fromCurrency].subtract(fromValue);
    this.pockets[inCurrency] = this.pockets[inCurrency].add(inValue);
  }

  constructor() {
    this.fx = new Fx();
    this.fetchRatesState = STATES.FETCH_RATES__INITIAL;
    this.fetchRatesFailCounter = 0;
    this.currency = CURRENCY;
    this.currencySymbol = CURRENCY_SYMBOLS;
    this.lastFocusedInputCurrency = 'out';

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

    this.fromCurrency = new InputCurrencyModel(this.currency[0]);
    this.inCurrency = new InputCurrencyModel(this.currency[1]);
  }
}

export default ExchangeModel;
