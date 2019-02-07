import mirrorkey from 'mirrorkey';

// export const RATES_ENDPOINT = 'http://localhost:4000/latest?base=GBP&symbols=USD,EUR,GBP';
export const RATES_ENDPOINT = 'http://localhost:4000/rates';
// export const RATES_ENDxPOINT = 'https://api.exchangeratesapi.io/latest?base=GBP&symbols=USD,EUR,GBP';
export const FETCH_RATES_ATTEMPTS = 5;

/**
 * @type {string[]} CURRENCY
 * @property {string} GBP
 * @property {string} EUR
 * @property {string} USD
 */
export const CURRENCY = ['GBP', 'EUR', 'USD'];

/**
 * @type {{USD: string, EUR: string, GBP: string}} CURRENCY_SYMBOLS
 */
export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};

/**
 * @type {{HOME: string, EXCHANGE: string}}
 */
export const ROUTES = {
  HOME: '/',
  EXCHANGE: '/exchange/',
};

/**
 * @type {Object} STATES
 * @property {string} FETCH_RATES__INITIAL
 * @property {string} FETCH_RATES__PENDING
 * @property {string} FETCH_RATES__SUCCESS
 * @property {string} FETCH_RATES__FAILURE
 */
export const STATES = mirrorkey([
  'FETCH_RATES__INITIAL',
  'FETCH_RATES__PENDING',
  'FETCH_RATES__SUCCESS',
  'FETCH_RATES__FAILURE',
]);
