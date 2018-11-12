import React from 'react';
import { shallow } from 'enzyme'; // import shallow renderer from enzyme
import Balances from '../../src/components/Balances';

function setup() {
  const props = {
    userId: 1,
    balances: {
      userBalance: 0,
      counterpartBalances: {},
    },
    contactSearchResults: [],
    contactSearchString: '',
    getStage: jest.fn(),
    showPayment: jest.fn(),
    payment: {},
    settleBalance: jest.fn(),
    fetchBalances: jest.fn(),
    handleContactSearch: jest.fn(),
    addContact: jest.fn(),
  };

  const wrapper = shallow(<Balances {...props} />);

  return {
    props,
    wrapper,
  };
}

describe('balances component', () => {
  const { wrapper, props } = setup();
  it('calls fetchBalances on mount', () => {
    expect(props.fetchBalances.mock.calls).toHaveLength(1);
  });
  it('renders counterparts after fetch', () => {
    wrapper.setProps({
      balances: {
        userBalance: 0,
        counterpartBalances: { 1: { username: 'Test', counterpart_id: 1, sum: '-10.00' } },
      },
    });
    expect(wrapper.find('.counterpart').exists()).toBe(true);
  });
  it('calls showPayment modal if pay button is clicked', () => {
    wrapper.find('.counterpart__btn').simulate('click');
    expect(props.showPayment).toHaveBeenCalled();
  });
  it('calls getStage with newRound when new round button is clicked', () => {
    wrapper.find('.new-round-btn').simulate('click');
    expect(props.getStage).toHaveBeenCalledWith('newRound');
  });
});