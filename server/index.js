import {app} from "./app.js"
import dotenv from "dotenv"
dotenv.config()
const PORT = process.env.PORT || 3001
import { connectDb } from "./database/index.js"

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })