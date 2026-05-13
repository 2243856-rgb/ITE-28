const sql = require("mssql");

let pool;

function useEntraAuth() {
  const v = process.env.AZURE_SQL_USE_ENTRA;
  return v === "true" || v === "1";
}

function isConfigured() {
  if (useEntraAuth()) {
    return Boolean(process.env.AZURE_SQL_SERVER && process.env.AZURE_SQL_DATABASE);
  }
  if (process.env.AZURE_SQL_CONNECTION_STRING) {
    return true;
  }
  return Boolean(
    process.env.AZURE_SQL_SERVER &&
      process.env.AZURE_SQL_DATABASE &&
      process.env.AZURE_SQL_USER &&
      process.env.AZURE_SQL_PASSWORD
  );
}

function poolOptions() {
  return {
    max: Number(process.env.AZURE_SQL_POOL_MAX || 10),
    min: 0,
    idleTimeoutMillis: 30_000
  };
}

function buildConfig() {
  if (useEntraAuth()) {
    const authOptions = {};
    if (process.env.AZURE_SQL_ENTRA_CLIENT_ID) {
      authOptions.clientId = process.env.AZURE_SQL_ENTRA_CLIENT_ID;
    }
    return {
      server: process.env.AZURE_SQL_SERVER,
      database: process.env.AZURE_SQL_DATABASE,
      authentication: {
        type: "azure-active-directory-default",
        options: authOptions
      },
      options: {
        encrypt: true,
        trustServerCertificate: process.env.AZURE_SQL_TRUST_CERT === "true"
      },
      pool: poolOptions()
    };
  }

  if (process.env.AZURE_SQL_CONNECTION_STRING) {
    return process.env.AZURE_SQL_CONNECTION_STRING;
  }

  return {
    server: process.env.AZURE_SQL_SERVER,
    database: process.env.AZURE_SQL_DATABASE,
    user: process.env.AZURE_SQL_USER,
    password: process.env.AZURE_SQL_PASSWORD,
    options: {
      encrypt: true,
      trustServerCertificate: process.env.AZURE_SQL_TRUST_CERT === "true"
    },
    pool: poolOptions()
  };
}

/**
 * Azure SQL via SQL login (connection string / user+password) or
 * Microsoft Entra only servers: set AZURE_SQL_USE_ENTRA=true and server+database
 * (uses DefaultAzureCredential: `az login` locally, managed identity on Azure).
 */
async function getPool() {
  if (!isConfigured()) {
    return null;
  }
  if (!pool) {
    const config = buildConfig();
    const newPool = new sql.ConnectionPool(config);
    newPool.on("error", (err) => {
      console.error("Azure SQL pool error:", err.message);
    });
    try {
      await newPool.connect();
      pool = newPool;
    } catch (err) {
      try {
        await newPool.close();
      } catch (_) {
        /* ignore */
      }
      throw err;
    }
  }
  return pool;
}

async function query(text) {
  const p = await getPool();
  if (!p) {
    throw new Error("Azure SQL is not configured.");
  }
  return p.request().query(text);
}

async function ping() {
  if (!isConfigured()) {
    return { configured: false, ok: false };
  }
  const started = Date.now();
  await query("SELECT 1 AS ok");
  const out = { configured: true, ok: true, latencyMs: Date.now() - started };
  if (useEntraAuth()) {
    out.auth = "entra";
  }
  return out;
}

async function closePool() {
  if (pool) {
    await pool.close();
    pool = null;
  }
}

module.exports = { getPool, query, ping, isConfigured, closePool, useEntraAuth };
