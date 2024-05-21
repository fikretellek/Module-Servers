import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import moment from "moment";

import validateNewBooking from "./functions/validateNewBooking.js";
import setNextId from "./functions/setNextId.js";
import readBookings from "./functions/readBookings.js";
import updateBookings from "./functions/updateBookings.js";

const app = express();
let bookings = [];

app.use(express.json());
app.use(cors());

app.use(readBookings(bookings));

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/bookings", (req, res) => {
  const newBooking = req.body;

  const validationResult = validateNewBooking(newBooking);
  if (validationResult !== true) {
    return res.status(400).json({ error: validationResult });
  }

  setNextId(newBooking, bookings);
  bookings.push(newBooking);
  updateBookings(JSON.stringify(bookings));

  res.status(201).json({ success: "Booking created!" });
});

app.get("/bookings/search", (req, res) => {
  const searchTerm = req.query.term;

  const matchingBookings = bookings.filter((booking) => {
    const { email, givenName, familyName } = booking;
    const emailMatch = email.toLowerCase().includes(searchTerm.toLowerCase());
    const firstNameMatch = givenName.toLowerCase().includes(searchTerm.toLowerCase());
    const surnameMatch = familyName.toLowerCase().includes(searchTerm.toLowerCase());
    return emailMatch || firstNameMatch || surnameMatch;
  });
  if (matchingBookings.length > 0) {
    res.status(200).json(matchingBookings);
  } else {
    res.status(404).json({ error: "Booking not found!" });
  }
});

app.get("/bookings/search-date", (req, res) => {
  const searchDate = req.query.date;
  const matchingBookings = bookings.filter((booking) => {
    const checkIn = moment(booking.checkInDate);
    const checkOut = moment(booking.checkOutDate);
    const search = moment(searchDate);
    return search.isSameOrAfter(checkIn) && search.isSameOrBefore(checkOut);
  });

  if (matchingBookings.length > 0) {
    res.status(200).json(matchingBookings);
  } else {
    res.status(404).json({ error: "Booking not found!" });
  }
});

app.get("/bookings/search", (req, res) => {
  const searchTerm = req.query.term;
  console.log("Search Term:", searchTerm);

  const matchingBookings = bookings.filter((booking) => {
    const { email, givenName, familyName } = booking;
    const emailMatch = email.toLowerCase().includes(searchTerm.toLowerCase());
    const firstNameMatch = givenName.toLowerCase().includes(searchTerm.toLowerCase());
    const surnameMatch = familyName.toLowerCase().includes(searchTerm.toLowerCase());

    console.log("Email Match:", emailMatch);
    console.log("First Name Match:", firstNameMatch);
    console.log("Surname Match:", surnameMatch);

    return emailMatch || firstNameMatch || surnameMatch;
  });

  console.log("Matching Bookings:", matchingBookings);

  if (matchingBookings.length > 0) {
    res.status(200).json(matchingBookings);
  } else {
    res.status(404).json({ error: "Booking not found!" });
  }
});

app.get("/bookings/:id", (req, res) => {
  const requestedId = req.params.id;
  const requestedBooking = bookings.find((booking) => booking.id === parseInt(requestedId));

  if (requestedBooking) {
    res.status(200).json(requestedBooking);
  } else {
    res.status(404).json({ error: "Booking not found!" });
  }
});

app.delete("/bookings/:id", (req, res) => {
  const deleteId = req.params.id;
  const bookingIndex = bookings.findIndex((booking) => booking.id === parseInt(deleteId));

  if (bookingIndex !== -1) {
    bookings.splice(bookingIndex, 1);
    updateBookings(JSON.stringify(bookings));
    res.status(200).json({ success: "Booking deleted!" });
  } else {
    res.status(404).json({ error: "Booking not found!" });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

app.set("view engine", "ejs");
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("views", path.join(__dirname, "views"));
app.get("/", (req, res) => {
  res.render("index", { title: "Hotel Booking Server" });
});
app.get("/guests", (req, res) => {
  res.render("guests", { bookings });
});
