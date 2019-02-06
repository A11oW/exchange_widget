import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import FieldGroupt from './FieldGroup';
import { Label, PocketCount, Value } from './FieldGroup.styles';

describe('<FieldGroupt />', () => {
  let props;

  beforeEach(() => {
    props = {
      label: 'USD',
      currency: {
        value: "0",
        format: '',
      },
      prefix: '',
      pristine: 2,
      pocket: {
        format: jest.fn(() => '$25'),
      },
      onChange: jest.fn(),
      onFocus: jest.fn(),
    };
  });

  test('render', () => {
    const wrapper = shallow(<FieldGroupt {...props} />);

    expect(wrapper).to.have.lengthOf(1);
  });

  test('render <Label />', () => {
    const wrapper = shallow(<FieldGroupt {...props} />);
    const $Label = wrapper.find(Label);

    expect($Label).to.have.lengthOf(1);
    expect($Label.text()).to.eq(props.label);
  });

  test('render <PocketCount />', () => {
    const wrapper = shallow(<FieldGroupt {...props} />);
    const $PocketCount = wrapper.find(PocketCount);

    expect($PocketCount).to.have.lengthOf(1);
    expect($PocketCount.text()).to.eq('You have $25');
  });

  test('render <Value />', () => {
    props.currency.value = "14";
    props.currency.format = '14.01';
    props.prefix = '-';
    const wrapper = mount(<FieldGroupt {...props} />);
    const $Value = wrapper.find(Value);

    expect($Value).to.have.lengthOf(1);
    expect($Value.getDOMNode().attributes.getNamedItem('value').value).eq('-14.01');
  });

  test('onChange <Value />', () => {
    props.currency.value = "14";
    props.currency.format = '14.01';
    props.prefix = '-';
    props.onChange = sinon.spy(value => value);

    const wrapper = mount(<FieldGroupt {...props} />);
    const $Value = wrapper.find(Value);
    const event = { target: { name: 'pollName', value: '85.345' } };
    $Value.update();

    $Value.simulate('change', event);

    expect(props.onChange.called).to.equal(true);
    expect(props.onChange.callCount).to.equal(1);
    expect(props.onChange.returnValues[0]).to.eq('85.34');
  });
});
