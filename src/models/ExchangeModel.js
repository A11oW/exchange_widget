import { action, computed, observable, reaction } from 'mobx';
import remotedev from 'mobx-remotedev';
import fx from 'money';
import currency from 'currency.js';
import api from '../api';

import InputCurrencyModel from './InputCurrencyModel';
import { CURRENCY, CURRENCY_SYMBOLS, FETCH_RATES_ATTEMPTS, STATES } from '../constants';

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

    this.fromCurrency.setValue('');
    this.inCurrency.setValue('');
  }

  @action changeFromValue(value) {
    this.fromCurrency.setValue(value);

    if (this.fromCurrency.currency === this.inCurrency.currency) {
      this.inCurrency.setValue(value);
      return;
    }

    this.inCurrency.setValue(
      this.fx.convert(value, {
        from: this.fromCurrency.currency,
        to: this.inCurrency.currency,
      }),
    );
  }

  @action changeInCurrency(currencyName) {
    this.inCurrency.setCurrency(currencyName);

    this.inCurrency.setValue('');
    this.fromCurrency.setValue('');
  }

  @action changeInValue(value) {
    this.inCurrency.setValue(value);

    if (this.inCurrency.currency === this.fromCurrency.currency) {
      this.fromCurrency.setValue(value);
      return;
    }

    this.fromCurrency.setValue(
      this.fx.convert(value, {
        from: this.inCurrency.currency,
        to: this.fromCurrency.currency,
      }),
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
      () => {
        if (this.lastFocusedInputCurrency === 'in') {
          const value = this.inCurrency.value;

          this.fromCurrency.setValue(
            this.fx.convert(value, {
              from: this.inCurrency.currency,
              to: this.fromCurrency.currency,
            }),
          );
        } else if (this.lastFocusedInputCurrency === 'out') {
          const value = this.fromCurrency.value;

          this.inCurrency.setValue(
            this.fx.convert(value, {
              from: this.fromCurrency.currency,
              to: this.inCurrency.currency,
            }),
          );
        }
      },
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

    if (timestamp < this.ratesTimestamp) {
      return;
    }

    this.ratesTimestamp = timestamp;
    this.rates = payload.rates;
    this.fx.base = payload.base;
    this.fx.rates = this.rates;
  }

  @action
  fetchRatesError(error) {
    // TODO differents logic from depending response codes (5xx, 4xx)
    // for example for 4xx don't retry request
    if (console.error) {
      console.error(error);
    } else {
      console.log(error);
    }

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
    const inValue = this.fx.convert(fromValue, {
      from: fromCurrency,
      to: inCurrency,
    });

    this.pockets[fromCurrency] = this.pockets[fromCurrency].subtract(fromValue);
    this.pockets[inCurrency] = this.pockets[inCurrency].add(inValue);
  }

  constructor() {
    this.fx = fx;
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
