/*
  Apply on existing nestvetdb if schema.sql was run before MVP persistence columns existed.
  Safe to run multiple times.
*/

IF COL_LENGTH('dbo.Appointments', 'IsActive') IS NULL
BEGIN
  ALTER TABLE dbo.Appointments ADD IsActive BIT NOT NULL CONSTRAINT DF_Appointments_IsActive DEFAULT (1);
END
GO

IF COL_LENGTH('dbo.HomeVisits', 'EtaMinutes') IS NULL
BEGIN
  ALTER TABLE dbo.HomeVisits ADD EtaMinutes INT NULL;
END
GO

IF COL_LENGTH('dbo.HomeVisits', 'LastTrackedLatitude') IS NULL
BEGIN
  ALTER TABLE dbo.HomeVisits ADD LastTrackedLatitude DECIMAL(9,6) NULL;
END
GO

IF COL_LENGTH('dbo.HomeVisits', 'LastTrackedLongitude') IS NULL
BEGIN
  ALTER TABLE dbo.HomeVisits ADD LastTrackedLongitude DECIMAL(9,6) NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Clinics WHERE ClinicId = '00000000-0000-4000-8000-000000000001')
BEGIN
  INSERT INTO dbo.Clinics (
    ClinicId, ClinicName, ContactEmail, ContactPhone, AddressLine, City, StateProvince, PostalCode, Country, IsActive
  )
  VALUES (
    '00000000-0000-4000-8000-000000000001',
    N'Default NestVet Clinic',
    N'support@nestvet.local',
    N'+63',
    N'123 Main Street',
    N'Metro Manila',
    NULL,
    N'0000',
    N'Philippines',
    1
  );
END
GO
