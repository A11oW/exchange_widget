import currency from 'currency.js';

import InputCurrencyModel from '../../src/models/InputCurrencyModel';
import ExchangeModel from '../../src/models/ExchangeModel';
import { CURRENCY, CURRENCY_SYMBOLS, STATES } from '../../src/constants';

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

  xtest('action changeFromCurrency', () => {
    const model = new ExchangeModel();

    expect(model.fromCurrency.value).toBe('');
    expect(model.inCurrency.value).toBe('');

    model.changeFromCurrency(CURRENCY[1]);

    // model.setExchange()
  });

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
