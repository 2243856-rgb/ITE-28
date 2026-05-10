const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
