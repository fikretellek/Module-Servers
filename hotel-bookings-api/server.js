const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Use this array as your (in-memory) data store.
let bookings = require('./bookings.json');

function validateRequestBody(body) {
  const requiredFields = [
    'title',
    'firstName',
    'surname',
    'email',
    'roomId',
    'checkInDate',
    'checkOutDate',
  ];
  return requiredFields.every((field) => Object.keys(body).includes(field));
}

app.get('/', function (request, response) {
  response.send('Hotel booking server.  Ask for /bookings, etc.');
});

// TODO add your routes and helper functions here

app.get('/bookings', function (request, response) {
  response.status(200).send({ bookings });
});

app.get('/bookings/:id', function (request, response) {
  const { id: chosenID } = request.params;
  const booking = bookings.find((booking) => booking.id === +chosenID);
  if (!booking) response.status(404).send({ message: 'No booking found' });
  else response.status(200).send({ booking });
});

app.post('/bookings', function (request, response) {
  const { body } = request;
  if (!validateRequestBody(body)) {
    response.status(400).send({ message: 'Malformed body' });
    return;
  }
  const id = bookings.length + 1;
  const newBooking = { ...body, id };
  bookings = [...bookings, newBooking];
  response.status(201).send({ booking: newBooking });
});

app.delete('/bookings/:id', function (request, response) {
  const { id: chosenID } = request.params;
  bookings = bookings.filter((booking) => booking.id !== +chosenID);
  response.sendStatus(202);
});

process.env.PORT = 9090;
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
