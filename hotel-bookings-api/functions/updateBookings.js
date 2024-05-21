import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const updateBookings = async (updatedBookings) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(__dirname, "../bookings.json");
  await fs.writeFile(filePath, updatedBookings);
};

export default updateBookings;
