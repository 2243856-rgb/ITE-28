const dotenv = require("dotenv");
dotenv.config();

// Microsoft Entra DB auth uses Azure CLI under the hood; Cursor/IDE terminals often omit CLI from PATH.
if (process.platform === "win32") {
  const cliWbin =
    process.env.AZURE_CLI_WBIN || "C:\\Program Files\\Microsoft SDKs\\Azure\\CLI2\\wbin";
  const cur = process.env.Path || process.env.PATH || "";
  if (cliWbin && !cur.toLowerCase().includes("azure\\cli2\\wbin")) {
    const next = `${cliWbin};${cur}`;
    process.env.Path = next;
    process.env.PATH = next;
  }
}

const app = require("./app");

const port = process.env.PORT || 4001;

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
