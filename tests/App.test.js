import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { Provider } from 'mobx-react';

import App from '../src/App';
import Loader from '../src/components/Loader';
import { CURRENCY, CURRENCY_SYMBOLS, STATES } from '../src/constants';

describe('<App />', () => {
  let Store;
  beforeEach(() => {
    Store = function () {
      return {
        currency: CURRENCY,
        currency_symbols: CURRENCY_SYMBOLS,

        fetchRatesState: STATES.FETCH_RATES__INITIAL,
        fetchRatesCounter: 0,

        rates: {},
        ratesTimestamp: 0,

        pockets: {},

        fromCurrency: {},
        inCurrency: {},

        lastFocusedInputCurrency: null,
      };
    };
  });

  test('render', () => {
    const store = new Store;
    const wrapper = shallow(<App store={store} />);

    expect(wrapper).to.have.lengthOf(1);
  });

  test('render Loader', () => {
    const store = new Store;
    const wrapper = mount(<App store={store} />);
    expect(wrapper).to.have.lengthOf(1);
    expect(wrapper.find(Loader)).to.have.lengthOf(1);
  });

  test('render Error state', () => {
    const store = new Store;
    store.fetchRatesState = STATES.FETCH_RATES__FAILURE;
    const wrapper = mount(<Provider store={store}><App /></Provider>);
    const h3 = wrapper.find('h3');
    expect(h3).to.have.lengthOf(1);
    expect(h3.text()).to.eq('🥺 Sorry, An error has occurred on the server.');
  });

  xtest('render routes', () => {
    const store = new Store;
    store.rates = {
      GBP: 1,
      USD: 1.3033607375,
      EUR: 1.1466180501,
    };
    const wrapper = mount(<Provider store={store}><App /></Provider>);
    expect(wrapper).to.have.lengthOf(1);
  });

  /*test('renders an `.icon-star`', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('.icon-star')).to.have.lengthOf(1);
  });

  test('renders children when passed in', () => {
    const wrapper = shallow((
      <App>
        <div className="unique" />
      </App>
    ));
    expect(wrapper.contains(<div className="unique" />)).to.equal(true);
  });

  test('simulates click events', () => {
    const onButtonClick = sinon.spy();
    const wrapper = shallow(<Foo onButtonClick={onButtonClick} />);
    wrapper.find('button').simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);
  });*/
});
