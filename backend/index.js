const dotenv = require("dotenv");
dotenv.config();

if (!process.env.JWT_SECRET && process.env.NODE_ENV !== "production") {
  process.env.JWT_SECRET = "nestvet-dev-jwt-secret-min-32-chars-long";
  // eslint-disable-next-line no-console
  console.warn("[auth] JWT_SECRET missing — using development fallback. Set JWT_SECRET in production.");
}

const app = require("./app");

const port = process.env.PORT || 4001;

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
