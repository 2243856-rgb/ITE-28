const dotenv = require("dotenv");
dotenv.config();

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "nestvet-dev-jwt-secret-min-32-chars-long";
  // eslint-disable-next-line no-console
  console.warn(
    "[auth] JWT_SECRET was not set; using a built-in fallback so login/register work. " +
      "Set JWT_SECRET in Azure App Service → Configuration (or .env locally) for production."
  );
}

const app = require("./app");
const { getPool } = require("./src/db/pool");

const port = process.env.PORT || 4001;

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
  if (process.env.SQL_CONNECTION_STRING) {
    getPool()
      .then((pool) => {
        if (pool) {
          // eslint-disable-next-line no-console
          console.log("[sql] SQL_CONNECTION_STRING is set; pool will connect on first use.");
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn("[sql] Pool init warning:", err.message);
      });
  }
});
