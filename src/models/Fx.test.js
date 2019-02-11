import Fx from './Fx';

describe('FxModle', () => {
  it('create new model', () => {
    const model = new Fx();
  });

  it('getRate', () => {
    const model = new Fx();
    const data = {
      base: 'GBP',
      date: '2019-02-08',
      'rates': {
        'GBP': 1,
        'USD': 1.2968339239,
        'EUR': 1.14298777,
      },
    };

    expect(() => model.getRate('USD', 'EUR')).toThrow('Empty rates');

    model.rates = data.rates;

    expect(() => model.getRate('USD', 'EUR')).toThrow('Empty base currency');

    model.base = data.base;

    expect(model.getRate('EUR', 'GBP')).toBe(1.14298777);
    expect(model.getRate('USD', 'GBP')).toBe(1.2968339239);
    expect(model.getRate('USD', 'EUR')).toBe(1.1346000000507441);

  });
});
