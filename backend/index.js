const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app"); // This imports the app.js code you just sent

// Azure provides the port via process.env.PORT
const port = process.env.PORT || 4001;

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});