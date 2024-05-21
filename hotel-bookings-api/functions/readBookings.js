import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const readBookings = (bookings) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(__dirname, "../bookings.json");
  return (req, res, next) => {
    fs.readFile(filePath).then((bookingsData) => {
      bookings.length = 0;
      const parsedBookings = JSON.parse(bookingsData);
      bookings.push(...parsedBookings);
      next();
    });
  };
};

export default readBookings;
