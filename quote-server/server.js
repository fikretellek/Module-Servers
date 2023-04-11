const express = require('express');
const app = express();

const quotes = require('./quotes.json');

app.get('/', function (request, response) {
  response.send("Neill's Quote Server!  Ask me for /quotes/random, or /quotes");
});

app.get('/quotes', function (request, response) {
  response.status(200).send({ quotes });
});

app.get('/quotes/random', function (request, response) {
  response.status(200).send({ quote: pickFromArray(quotes) });
});

app.get('/quotes/search', function (request, response) {
  const { term = '' } = request.query;
  const loweredTerm = term.toLowerCase();
  const filteredQuotes = quotes.filter(({ quote, author }) => {
    return quote.toLowerCase().includes(loweredTerm) || author.toLowerCase().includes(loweredTerm);
  });
  response.status(200).send({ quotes: filteredQuotes });
});

function pickFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
