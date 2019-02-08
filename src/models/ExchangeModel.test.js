import currency from 'currency.js';
import { when } from 'mobx';

import InputCurrencyModel from './InputCurrencyModel';
import ExchangeModel from './ExchangeModel';
import { CURRENCY, CURRENCY_SYMBOLS, STATES } from '../constants';

describe('ExchangeModel', () => {
  let model;
  beforeEach(() => {
    model = new ExchangeModel();
  });

  it('create new model', () => {
    expect(model.fx.rates).toEqual({});
    expect(model.fx.timestamp).toBe(0);
    expect(model.fx.base).toBeNull();
    expect(model.fetchRatesState).toBe(STATES.FETCH_RATES__INITIAL);
    expect(model.fetchRatesFailCounter).toBe(0);
    expect(model.currency).toEqual(CURRENCY);
    expect(model.currencySymbol).toEqual(CURRENCY_SYMBOLS);
    expect(model.pockets.GBP instanceof currency).toBeTruthy();
    expect(model.pockets.EUR instanceof currency).toBeTruthy();
    expect(model.pockets.USD instanceof currency).toBeTruthy();
    expect(model.pockets.GBP.value).toBe(58.33);
    expect(model.pockets.EUR.value).toBe(116.2);
    expect(model.pockets.USD.value).toBe(25.51);
    expect(model.fromCurrency instanceof InputCurrencyModel).toBeTruthy();
    expect(model.fromCurrency instanceof InputCurrencyModel).toBeTruthy();
    expect(model.fromCurrency instanceof InputCurrencyModel).toBeTruthy();
    expect(model.fromCurrency instanceof InputCurrencyModel).toBeTruthy();
  });

  it('action setFromCurrency', () => {
    expect(model.fromCurrency.value).toBe('');
    expect(model.inCurrency.value).toBe('');

    model.setFromCurrency('USD');

    expect(model.fromCurrency.currency).toBe('USD');
    expect(() => model.setFromCurrency('RUB')).toThrow(
      'Argument currencyName must be one of Model.currency list'
    );
  });

  it('action setInCurrency', () => {
    expect(model.fromCurrency.value).toBe('');
    expect(model.inCurrency.value).toBe('');

    model.setInCurrency('USD');

    expect(model.inCurrency.currency).toBe('USD');
    expect(() => model.setInCurrency('RUB')).toThrow(
      'Argument currencyName must be one of Model.currency list'
    );
  });

  it('action setRates', () => {
    const rates = {
      date: '12.02.1999',
      base: 'GBP',
      rates: {
        GBP: 1,
        USD: 2,
        EUR: 10,
      },
    };

    model.setRates(rates);

    expect(model.fx.rates.GBP).toBe(1);
    expect(model.fx.rates.USD).toBe(2);
    expect(model.fx.rates.EUR).toBe(10);
    expect(model.fx.timestamp).toBe(new Date('12.02.1999').getTime());
    expect(model.fx.rates).toEqual(rates.rates);
    expect(model.fx.base).toEqual('GBP');
    expect(model.fx.rates).toEqual(rates.rates);

    expect(() => {
      model.setRates();
    }).toThrow('Argument payload must be not empty');
    expect(() => {
      model.setRates({
        data: 'sdfgknj',
        rates: {
          GBP: 1,
          USD: 2,
          EUR: 10,
        },
      });
    }).toThrow('Invalid rates date');

    rates.date = '10.02.1998';
    model.setRates(rates);

    expect(model.fx.rates.GBP).toBe(1);
    expect(model.fx.rates.USD).toBe(2);
    expect(model.fx.rates.EUR).toBe(10);
    expect(model.fx.timestamp).toBe(new Date('12.02.1999').getTime());
    expect(model.fx.rates).toEqual(rates.rates);
    expect(model.fx.base).toEqual('GBP');
    expect(model.fx.rates).toEqual(rates.rates);
  });

  describe('action setFromValue', () => {
    const rates = {
      date: '12.02.1996',
      base: 'GBP',
      rates: {
        GBP: 1,
        USD: 2,
        EUR: 10,
      },
    };

    it('changeValue', () => {
      model.setRates(rates);
      model.setFromValue('34');
      expect(model.fromCurrency.value).toBe('34');
      expect(model.inCurrency.value).toBe('340');
    });

    it('changeValue with same currency', () => {
      expect(model.fromCurrency.currency).toBe('GBP');
      expect(model.inCurrency.currency).toBe('EUR');

      model.setInCurrency('GBP');
      expect(model.inCurrency.currency).toBe('GBP');

      model.setFromValue('10.47');
      expect(model.fromCurrency.value).toBe('10.47');
      expect(model.inCurrency.value).toBe('10.47');
    });
  });

  describe('action setInValue', () => {
    const rates = {
      date: '12.02.1996',
      base: 'GBP',
      rates: {
        GBP: 1,
        USD: 1.35,
        EUR: 1.24,
      },
    };

    it('changeValue', () => {
      model.setRates(rates);
      model.setInValue('63');
      expect(model.inCurrency.value).toBe('63');
      expect(model.fromCurrency.value).toBe('50.80645161290323');
    });

    it('changeValue with same currency', () => {
      expect(model.fromCurrency.currency).toBe('GBP');
      expect(model.inCurrency.currency).toBe('EUR');

      model.setFromCurrency('EUR');
      expect(model.fromCurrency.currency).toBe('EUR');

      model.setInValue('0.37');
      expect(model.fromCurrency.value).toBe('0.37');
      expect(model.inCurrency.value).toBe('0.37');
    });
  });

  it('action setFocusedInputCurrency', () => {
    expect(model.lastFocusedInputCurrency).toBe('out');

    model.setFocusedInputCurrency('in');
    expect(model.lastFocusedInputCurrency).toBe('in');

    model.setFocusedInputCurrency('out');
    expect(model.lastFocusedInputCurrency).toBe('out');

    expect(() => {
      model.setFocusedInputCurrency();
    }).toThrow('Argument inputType must be "in" or "out" string');
  });

  it('computed get currencyRate', () => {
    const rates = {
      date: '12.02.1996',
      base: 'GBP',
      rates: {
        GBP: 1,
        USD: 1.2928774929,
        EUR: 1.1396011396,
      },
    };

    model.setRates(rates);

    expect(model.fromCurrency.currency).toBe('GBP');
    expect(model.inCurrency.currency).toBe('EUR');
    expect(model.fx.rates[model.inCurrency.currency]).toBe(1.1396011396);
    expect(model.fx.rates[model.fromCurrency.currency]).toBe(1);
    expect(model.currencyRate).toBe(1.1396);

    model.setFromCurrency('USD');

    expect(model.fromCurrency.currency).toBe('USD');
    expect(model.currencyRate).toBe(0.8814);
  });

  it('action setExchange', () => {
    const rates = {
      date: '12.02.2000',
      base: 'GBP',
      rates: {
        GBP: 1,
        USD: 1.2928774929,
        EUR: 1.1396011396,
      },
    };

    model.setRates(rates);

    expect(model.pockets.GBP.value).toBe(58.33);
    expect(model.pockets.EUR.value).toBe(116.2);
    expect(model.pockets.USD.value).toBe(25.51);
    expect(model.fx.rates.GBP).toBe(1);
    expect(model.fx.rates.USD).toBe(1.2928774929);
    expect(model.fx.rates.EUR).toBe(1.1396011396);

    model.setFromValue(1);
    model.setExchange();

    expect(model.pockets.GBP.value).toBe(57.33);
    expect(model.pockets.EUR.value).toBe(117.34);
    expect(model.pockets.USD.value).toBe(25.51);
  });

  describe('action fetchRates', () => {
    it('fetchRatesSuccess', () => {
      // expect.assertions(1);
      const modelAsync = new ExchangeModel();
      const response = {
        base: 'GBP',
        date: '02.06.2015',
        rates: {
          GBP: 1,
          USD: 1.2904589345,
          EUR: 1.1556475676,
        },
      };

      fetch.resetMocks();
      fetch.mockResponseOnce(JSON.stringify(response));

      modelAsync.fetchRates();

      when(
        () => modelAsync.fetchRatesState === STATES.FETCH_RATES__SUCCESS
      ).then(() => {
        expect(modelAsync.rates.GBP).toBe(1);
        expect(modelAsync.rates.USD).toBe(1.2904589345);
        expect(modelAsync.rates.EUR).toBe(1.1556475676);
        expect(modelAsync.fx.timestamp).toBe(new Date('02.06.2015').getTime());
        expect(modelAsync.rates).toEqual(response.rates);
        expect(modelAsync.fx.base).toEqual('GBP');
        expect(modelAsync.fx.rates).toEqual(response.rates);
      });
    });

    it('fetchRatesError', async () => {
      const modelAsync = new ExchangeModel();
      const consoleErrorMock = jest.spyOn(global.console, 'warn');

      fetch.resetMocks();
      fetch.mockReject('Server error');

      when(
        () => modelAsync.fetchRatesState === STATES.FETCH_RATES__FAILURE
      ).then(() => {
        expect(consoleErrorMock).toHaveBeenCalledTimes(5);
        consoleErrorMock.mockRestore();
      });

      modelAsync.fetchRates();
    });
  });

  it('enableReactionOnChangingRates', () => {
    const model = new ExchangeModel();
    model.enableReactionOnChangingRates();

    const rates = [
      {
        base: 'GBP',
        date: '01.01.2019',
        rates: {
          GBP: 1,
          USD: 1.3033607375,
          EUR: 1.1466180501,
        },
      },
      {
        base: 'GBP',
        date: '02.01.2019',
        rates: {
          GBP: 1,
          USD: 1.2904589345,
          EUR: 1.1556475676,
        },
      },
    ];

    model.setRates(rates[0]);
    model.setFromValue(1);

    expect(model.fromCurrency.value).toBe('1');
    expect(model.inCurrency.value).toBe('1.1466180501');
    model.setRates(rates[1]);
    expect(model.inCurrency.value).toBe('1.1556475676');
  });
});
