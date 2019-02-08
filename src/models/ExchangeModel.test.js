import currency from 'currency.js';

import InputCurrencyModel from './InputCurrencyModel';
import ExchangeModel from './ExchangeModel';
import { CURRENCY, CURRENCY_SYMBOLS, STATES } from '../constants';

describe('ExchangeModel', () => {
  test('create new model', () => {
    const model = new ExchangeModel();

    expect(model.rates).toEqual({});
    expect(model.fetchRatesState).toBe(STATES.FETCH_RATES__INITIAL);
    expect(model.ratesTimestamp).toBe(0);
    expect(model.fetchRatesFailCounter).toBe(0);
    expect(model.currency).toEqual(CURRENCY);
    expect(model.currencySymbol).toEqual(CURRENCY_SYMBOLS);
    expect(model.pockets.GBP instanceof currency).toBeTruthy();
    expect(model.pockets.EUR instanceof currency).toBeTruthy();
    expect(model.pockets.USD instanceof currency).toBeTruthy();
    expect(model.fromCurrency instanceof InputCurrencyModel).toBeTruthy();
    expect(model.fromCurrency instanceof InputCurrencyModel).toBeTruthy();
    expect(model.fromCurrency instanceof InputCurrencyModel).toBeTruthy();
    expect(model.fromCurrency instanceof InputCurrencyModel).toBeTruthy();
  });

  test('action changeFromCurrency', () => {
    const model = new ExchangeModel();

    expect(model.fromCurrency.value).toBe('');
    expect(model.inCurrency.value).toBe('');

    model.changeFromCurrency('USD');

    expect(model.fromCurrency.currency).toBe('USD');
  });

  test('action changeInCurrency', () => {
    const model = new ExchangeModel();

    expect(model.fromCurrency.value).toBe('');
    expect(model.inCurrency.value).toBe('');

    model.changeInCurrency('USD');

    expect(model.inCurrency.currency).toBe('USD');
  });

  test('action setRates', () => {
    const model = new ExchangeModel();
    const rates = {
      date: "12.02.1999",
      base: "GBP",
      rates: {
        GBP: 1,
        USD: 2,
        EUR: 10,
      },
    };

    model.setRates(rates);

    expect(model.rates.GBP).toBe(1);
    expect(model.rates.USD).toBe(2);
    expect(model.rates.EUR).toBe(10);
    expect(model.ratesTimestamp).toBe(new Date("12.02.1999").getTime());
    expect(model.rates).toEqual(rates.rates);
    expect(model.fx.base).toEqual("GBP");
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

    rates.date = "10.02.1998";
    model.setRates(rates);

    expect(model.rates.GBP).toBe(1);
    expect(model.rates.USD).toBe(2);
    expect(model.rates.EUR).toBe(10);
    expect(model.ratesTimestamp).toBe(new Date("12.02.1999").getTime());
    expect(model.rates).toEqual(rates.rates);
    expect(model.fx.base).toEqual("GBP");
    expect(model.fx.rates).toEqual(rates.rates);
  });

  describe('action changeFromValue', () => {
    const model = new ExchangeModel();
    const rates = {
      date: "12.02.1996",
      base: "GBP",
      rates: {
        GBP: 1,
        USD: 2,
        EUR: 10,
      },
    };

    test('changeValue', () => {
      model.setRates(rates);
      model.changeFromValue('34');
      expect(model.fromCurrency.value).toBe('34');
      expect(model.inCurrency.value).toBe('340');
    });

    test('changeValue with same currency', () => {
      expect(model.fromCurrency.currency).toBe('GBP');
      expect(model.inCurrency.currency).toBe('EUR');

      model.changeInCurrency('GBP');
      expect(model.inCurrency.currency).toBe('GBP');

      model.changeFromValue('10.47');
      expect(model.fromCurrency.value).toBe('10.47');
      expect(model.inCurrency.value).toBe('10.47');
    })
  });

  describe('action changeInValue', () => {
    const model = new ExchangeModel();
    const rates = {
      date: "12.02.1996",
      base: "GBP",
      rates: {
        GBP: 1,
        USD: 1.35,
        EUR: 1.24,
      },
    };

    test('changeValue', () => {
      model.setRates(rates);
      model.changeInValue('63');
      expect(model.inCurrency.value).toBe('63');
      expect(model.fromCurrency.value).toBe('50.80645161290323');

    });

    test('changeValue with same currency', () => {
      expect(model.fromCurrency.currency).toBe('GBP');
      expect(model.inCurrency.currency).toBe('EUR');

      model.changeFromCurrency('EUR');
      expect(model.fromCurrency.currency).toBe('EUR');

      model.changeInValue('0.37');
      expect(model.fromCurrency.value).toBe('0.37');
      expect(model.inCurrency.value).toBe('0.37');
    })
  });

  test('action setFocusedInputCurrency', () => {
    const model = new ExchangeModel();

    expect(model.lastFocusedInputCurrency).toBe();

    model.setFocusedInputCurrency("in");
    expect(model.lastFocusedInputCurrency).toBe('in');

    model.setFocusedInputCurrency("out");
    expect(model.lastFocusedInputCurrency).toBe('out');

    expect(() => { model.setFocusedInputCurrency(); }).toThrow('Argument inputType must be "in" or "out" string');
  })

  /*  test('create new model', () => {
      const model = new InputCurrencyModel("USD");
      expect(model.value).toBe(0);
      expect(model.currency).toBe("USD");
      expect(model.format).toBe("0");
    });

    test('empty currency', () => {
      expect(() => { new InputCurrencyModel() }).toThrow('Argument currency must be not empty');
    });

    test('setValue', () => {
      const value = 23424.45465;
      const model = new InputCurrencyModel("USD");
      model.setValue(23424.45465);

      expect(model.value).toBe(value);
      expect(model.format).toBe("23424.45");
      expect(() => { model.setValue("4269") }).toThrow('Argument value must be a number');
    });*/
});
