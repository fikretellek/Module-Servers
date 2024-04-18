import express, { response } from "express";

const app = express();

let quotes = [];

app.use(async (req, res, next) => {
  const response = await fetch("https://api.quotable.io/quotes?limit=150");
  const data = await response.json();
  quotes = data.results;
  next();
});

app.get("/", (request, response) => {
  response.send(
    "Fikret's Quote Server!  Ask me for /quotes/random, /quotes or /quotes/search?term=(something)"
  );
});

//START OF YOUR CODE...
app.get("/quotes", (req, res) => {
  res.json({ quotes });
});

app.get("/quotes/random", (req, res) => {
  const randomQuote = pickFromArray(quotes);
  res.json({ randomQuote });
});

app.get("/quotes/search", (req, res) => {
  console.log(req.query);
  const searchTerm = req.query.term.toLowerCase();

  const filteredQuotes = quotes.filter(
    (quoteObject) =>
      quoteObject.content.toLowerCase().includes(searchTerm) ||
      quoteObject.author.toLowerCase().includes(searchTerm)
  );
  res.json({ filteredQuotes });
});

app.get("/echo", (req, res) => {
  res.json(req.query.word);
});
//...END OF YOUR CODE

const pickFromArray = (arrayOfQuotes) =>
  arrayOfQuotes[Math.floor(Math.random() * arrayOfQuotes.length)];

const listener = app.listen(3001, () => {
  console.log("Your app is listening on port 3001");
});
