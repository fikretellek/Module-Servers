import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = parseInt(process.env.PORT || "3000");

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
