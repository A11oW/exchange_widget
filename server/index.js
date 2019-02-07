var express = require('express');
var proxy = require('express-http-proxy');
var cors = require('cors');
var app = express();

app.use(cors());

const port = 4000;
const RATES_HOST = 'https://api.exchangeratesapi.io';
const RATES_DATA = [
  {
    base: 'GBP',
    rates: {
      GBP: 1,
      USD: 1.3033607375,
      EUR: 1.1466180501,
    },
  },
  {
    base: 'GBP',
    rates: {
      GBP: 1,
      USD: 1.2904589345,
      EUR: 1.1556475676,
    },
  },
];

app.get('/rates', function(req, res) {
  const number = Math.round(Math.random());
  const rates = RATES_DATA[number];

  rates.timestamp = new Date().getTime();

  res.json(rates);
});

app.all('/latest', proxy(RATES_HOST));

app.listen(port, function() {
  console.log(`Rates app listening on port ${port}!`);
});
