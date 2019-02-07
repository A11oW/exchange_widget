import InputCurrencyModel from '../../src/models/InputCurrencyModel';

describe('InputCurrencyModel', () => {
  test('create new model', () => {
    const model = new InputCurrencyModel('USD');
    expect(model.value).toBe('');
    expect(model.currency).toBe('USD');
    expect(model.format).toBe('');
  });

  test('empty currency', () => {
    expect(() => {
      new InputCurrencyModel();
    }).toThrow('Argument currency must be not empty');
  });

  xtest('setValue', () => {
    const value = '23424.45465';
    const model = new InputCurrencyModel('USD');
    model.setValue(23424.45465);

    expect(model.value).toBe(value);
    expect(model.format).toBe('23424.45');
    expect(() => {
      model.setValue();
    }).toThrow('Argument value must be string');
  });
});
