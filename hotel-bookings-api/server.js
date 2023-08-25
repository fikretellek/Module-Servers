const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/bookings", function (req, res) {
  res.json(dataStore);
});

app.get("/bookings/:id", function (req, res) {
  const id = parseInt(req.params.id);
  const booking = dataStore.find((booking) => booking.id === id);

  if (booking) {
    res.json(booking);
  } else {
    res.status(404).json({ error: "Booking not found" });
  }
});

app.post("/bookings", function (req, res) {
  const newBooking = req.body;

  if (!isValidBooking(newBooking)) {
    res.status(400).json({ error: "Invalid booking data" });
  } else {
    newBooking.id = generateNewId();
    dataStore.push(newBooking);
    res.status(201).json(newBooking);
  }
});

app.delete("/bookings/:id", function (req, res) {
  const id = parseInt(req.params.id);
  const index = dataStore.findIndex((booking) => booking.id === id);

  if (index !== -1) {
    dataStore.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: "Booking not found" });
  }
});

app.get("/bookings/search", function (req, res) {
  const date = req.query.date;
  const matchingBookings = dataStore.filter(
    (booking) =>
      booking.checkInDate <= date && booking.checkOutDate >= date
  );

  res.json(matchingBookings);
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

function generateNewId() {
  const ids = dataStore.map((booking) => booking.id);
  return Math.max(...ids) + 1;
}

function isValidBooking(booking) {
  return (
    booking.roomId &&
    booking.title &&
    booking.firstName &&
    booking.surname &&
    booking.email &&
    booking.checkInDate &&
    booking.checkOutDate
  );
}
