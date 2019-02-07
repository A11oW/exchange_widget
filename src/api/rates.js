import { RATES_ENDPOINT } from '../constants';

export const getRates = () => {
  return fetch(RATES_ENDPOINT);
};
