const { v4: uuidv4 } = require("uuid");
const sql = require("mssql");
const { getPool, isConfigured } = require("../../db/pool");
const { HttpError } = require("../../utils/http-error");

function requireDb() {
  if (!isConfigured()) {
    throw new HttpError(503, "DATABASE_UNAVAILABLE", "Azure SQL is not configured.");
  }
}

function mapPetRow(r) {
  return {
    petId: String(r.PetId),
    ownerUserId: String(r.OwnerUserId),
    petName: r.PetName,
    species: r.Species,
    breed: r.Breed,
    sex: r.Sex,
    dateOfBirth: r.DateOfBirth ? r.DateOfBirth.toISOString().slice(0, 10) : null,
    weightKg: r.WeightKg != null ? Number(r.WeightKg) : null,
    allergies: r.Allergies,
    chronicConditions: r.ChronicConditions,
    isActive: Boolean(r.IsActive),
    createdAt: r.CreatedAt ? new Date(r.CreatedAt).toISOString() : null,
    updatedAt: r.UpdatedAt ? new Date(r.UpdatedAt).toISOString() : null
  };
}

async function createPet(ownerUserId, payload) {
  requireDb();
  const pool = await getPool();
  const petId = uuidv4();
  const sex = String(payload.sex || "UNKNOWN").toUpperCase();

  await pool
    .request()
    .input("petId", sql.UniqueIdentifier, petId)
    .input("ownerUserId", sql.UniqueIdentifier, ownerUserId)
    .input("petName", sql.NVarChar(120), String(payload.petName).trim())
    .input("species", sql.NVarChar(50), String(payload.species).trim())
    .input("breed", sql.NVarChar(100), payload.breed ? String(payload.breed).trim() : null)
    .input("sex", sql.NVarChar(10), sex)
    .input("dateOfBirth", sql.Date, payload.dateOfBirth ? new Date(payload.dateOfBirth) : null)
    .input("weightKg", sql.Decimal(6, 2), payload.weightKg != null ? Number(payload.weightKg) : null)
    .input("allergies", sql.NVarChar(1000), payload.allergies || null)
    .input("chronicConditions", sql.NVarChar(1000), payload.chronicConditions || null)
    .query(`
      INSERT INTO dbo.Pets (
        PetId, OwnerUserId, PetName, Species, Breed, Sex, DateOfBirth, WeightKg,
        Color, MicrochipId, Allergies, ChronicConditions, IsActive
      )
      VALUES (
        @petId, @ownerUserId, @petName, @species, @breed, @sex, @dateOfBirth, @weightKg,
        NULL, NULL, @allergies, @chronicConditions, 1
      )
    `);

  const out = await pool
    .request()
    .input("petId", sql.UniqueIdentifier, petId)
    .query(`
      SELECT PetId, OwnerUserId, PetName, Species, Breed, Sex, DateOfBirth, WeightKg,
             Allergies, ChronicConditions, IsActive, CreatedAt, UpdatedAt
      FROM dbo.Pets WHERE PetId = @petId
    `);

  return mapPetRow(out.recordset[0]);
}

async function listPets(requestUser, ownerUserIdQuery) {
  requireDb();
  const pool = await getPool();
  const rq = pool.request();

  if (requestUser.role === "OWNER") {
    rq.input("ownerId", sql.UniqueIdentifier, requestUser.sub);
    const { recordset } = await rq.query(`
      SELECT PetId, OwnerUserId, PetName, Species, Breed, Sex, DateOfBirth, WeightKg,
             Allergies, ChronicConditions, IsActive, CreatedAt, UpdatedAt
      FROM dbo.Pets
      WHERE OwnerUserId = @ownerId AND IsActive = 1
      ORDER BY CreatedAt DESC
    `);
    return recordset.map(mapPetRow);
  }

  if (ownerUserIdQuery) {
    rq.input("ownerId", sql.UniqueIdentifier, ownerUserIdQuery);
    const { recordset } = await rq.query(`
      SELECT PetId, OwnerUserId, PetName, Species, Breed, Sex, DateOfBirth, WeightKg,
             Allergies, ChronicConditions, IsActive, CreatedAt, UpdatedAt
      FROM dbo.Pets
      WHERE OwnerUserId = @ownerId AND IsActive = 1
      ORDER BY CreatedAt DESC
    `);
    return recordset.map(mapPetRow);
  }

  const { recordset } = await pool.request().query(`
    SELECT PetId, OwnerUserId, PetName, Species, Breed, Sex, DateOfBirth, WeightKg,
           Allergies, ChronicConditions, IsActive, CreatedAt, UpdatedAt
    FROM dbo.Pets
    WHERE IsActive = 1
    ORDER BY CreatedAt DESC
  `);
  return recordset.map(mapPetRow);
}

async function getPetById(requestUser, petId) {
  requireDb();
  const pool = await getPool();
  const { recordset } = await pool
    .request()
    .input("petId", sql.UniqueIdentifier, petId)
    .query(`
      SELECT PetId, OwnerUserId, PetName, Species, Breed, Sex, DateOfBirth, WeightKg,
             Allergies, ChronicConditions, IsActive, CreatedAt, UpdatedAt
      FROM dbo.Pets
      WHERE PetId = @petId AND IsActive = 1
    `);

  const row = recordset[0];
  if (!row) {
    throw new HttpError(404, "PET_NOT_FOUND", "Pet not found.");
  }

  if (requestUser.role === "OWNER" && String(row.OwnerUserId) !== requestUser.sub) {
    throw new HttpError(403, "FORBIDDEN", "You cannot access this pet profile.");
  }

  return mapPetRow(row);
}

async function updatePet(requestUser, petId, payload) {
  await getPetById(requestUser, petId);
  const pool = await getPool();
  const rq = pool.request().input("petId", sql.UniqueIdentifier, petId);
  const sets = [];

  if (payload.petName != null) {
    sets.push("PetName = @petName");
    rq.input("petName", sql.NVarChar(120), String(payload.petName).trim());
  }
  if (payload.species != null) {
    sets.push("Species = @species");
    rq.input("species", sql.NVarChar(50), String(payload.species).trim());
  }
  if (payload.breed !== undefined) {
    sets.push("Breed = @breed");
    rq.input("breed", sql.NVarChar(100), payload.breed ? String(payload.breed).trim() : null);
  }
  if (payload.sex != null) {
    sets.push("Sex = @sex");
    rq.input("sex", sql.NVarChar(10), String(payload.sex).toUpperCase());
  }
  if (payload.dateOfBirth !== undefined) {
    sets.push("DateOfBirth = @dateOfBirth");
    rq.input("dateOfBirth", sql.Date, payload.dateOfBirth ? new Date(payload.dateOfBirth) : null);
  }
  if (payload.weightKg !== undefined) {
    sets.push("WeightKg = @weightKg");
    rq.input("weightKg", sql.Decimal(6, 2), payload.weightKg != null ? Number(payload.weightKg) : null);
  }
  if (payload.allergies !== undefined) {
    sets.push("Allergies = @allergies");
    rq.input("allergies", sql.NVarChar(1000), payload.allergies || null);
  }
  if (payload.chronicConditions !== undefined) {
    sets.push("ChronicConditions = @chronicConditions");
    rq.input("chronicConditions", sql.NVarChar(1000), payload.chronicConditions || null);
  }

  if (sets.length === 0) {
    return getPetById(requestUser, petId);
  }

  sets.push("UpdatedAt = SYSUTCDATETIME()");
  await rq.query(`UPDATE dbo.Pets SET ${sets.join(", ")} WHERE PetId = @petId`);
  return getPetById(requestUser, petId);
}

async function removePet(requestUser, petId) {
  await getPetById(requestUser, petId);
  const pool = await getPool();
  await pool
    .request()
    .input("petId", sql.UniqueIdentifier, petId)
    .query(`UPDATE dbo.Pets SET IsActive = 0, UpdatedAt = SYSUTCDATETIME() WHERE PetId = @petId`);
}

module.exports = { createPet, listPets, getPetById, updatePet, removePet };
