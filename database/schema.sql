/*
  Cloud Veterinary Booking System - Initial SQL Schema
  Target: Azure SQL Database / SQL Server
*/

/* Cleanup for repeatable local setup */
IF OBJECT_ID('dbo.AuditLogs', 'U') IS NOT NULL DROP TABLE dbo.AuditLogs;
IF OBJECT_ID('dbo.NotificationLogs', 'U') IS NOT NULL DROP TABLE dbo.NotificationLogs;
IF OBJECT_ID('dbo.ChatMessages', 'U') IS NOT NULL DROP TABLE dbo.ChatMessages;
IF OBJECT_ID('dbo.ChatSessions', 'U') IS NOT NULL DROP TABLE dbo.ChatSessions;
IF OBJECT_ID('dbo.Prescriptions', 'U') IS NOT NULL DROP TABLE dbo.Prescriptions;
IF OBJECT_ID('dbo.MedicalRecords', 'U') IS NOT NULL DROP TABLE dbo.MedicalRecords;
IF OBJECT_ID('dbo.HomeVisits', 'U') IS NOT NULL DROP TABLE dbo.HomeVisits;
IF OBJECT_ID('dbo.Appointments', 'U') IS NOT NULL DROP TABLE dbo.Appointments;
IF OBJECT_ID('dbo.Veterinarians', 'U') IS NOT NULL DROP TABLE dbo.Veterinarians;
IF OBJECT_ID('dbo.Pets', 'U') IS NOT NULL DROP TABLE dbo.Pets;
IF OBJECT_ID('dbo.Clinics', 'U') IS NOT NULL DROP TABLE dbo.Clinics;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
GO

CREATE TABLE dbo.Users (
    UserId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    FullName NVARCHAR(120) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PhoneNumber NVARCHAR(30) NULL,
    Role NVARCHAR(20) NOT NULL CHECK (Role IN ('OWNER', 'VET', 'CLINIC_STAFF', 'ADMIN')),
    PasswordHash NVARCHAR(255) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.Clinics (
    ClinicId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    ClinicName NVARCHAR(180) NOT NULL,
    ContactEmail NVARCHAR(255) NULL,
    ContactPhone NVARCHAR(30) NULL,
    AddressLine NVARCHAR(255) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    StateProvince NVARCHAR(100) NULL,
    PostalCode NVARCHAR(20) NULL,
    Country NVARCHAR(100) NOT NULL DEFAULT 'Philippines',
    Latitude DECIMAL(9,6) NULL,
    Longitude DECIMAL(9,6) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.Pets (
    PetId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    OwnerUserId UNIQUEIDENTIFIER NOT NULL,
    PetName NVARCHAR(120) NOT NULL,
    Species NVARCHAR(50) NOT NULL,
    Breed NVARCHAR(100) NULL,
    Sex NVARCHAR(10) NULL CHECK (Sex IN ('MALE', 'FEMALE', 'UNKNOWN')),
    DateOfBirth DATE NULL,
    WeightKg DECIMAL(6,2) NULL,
    Color NVARCHAR(60) NULL,
    MicrochipId NVARCHAR(80) NULL,
    Allergies NVARCHAR(1000) NULL,
    ChronicConditions NVARCHAR(1000) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Pets_Users_OwnerUserId FOREIGN KEY (OwnerUserId) REFERENCES dbo.Users(UserId)
);
GO

CREATE TABLE dbo.Veterinarians (
    VeterinarianId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL UNIQUE,
    ClinicId UNIQUEIDENTIFIER NOT NULL,
    LicenseNumber NVARCHAR(80) NOT NULL,
    Specialization NVARCHAR(120) NULL,
    YearsOfExperience INT NULL,
    IsAvailableForHomeVisit BIT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Veterinarians_Users_UserId FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId),
    CONSTRAINT FK_Veterinarians_Clinics_ClinicId FOREIGN KEY (ClinicId) REFERENCES dbo.Clinics(ClinicId)
);
GO

CREATE TABLE dbo.Appointments (
    AppointmentId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    PetId UNIQUEIDENTIFIER NOT NULL,
    OwnerUserId UNIQUEIDENTIFIER NOT NULL,
    ClinicId UNIQUEIDENTIFIER NOT NULL,
    VeterinarianId UNIQUEIDENTIFIER NULL,
    AppointmentType NVARCHAR(20) NOT NULL CHECK (AppointmentType IN ('CLINIC', 'HOME_VISIT', 'TELECONSULT')),
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
    ScheduledStart DATETIME2 NOT NULL,
    ScheduledEnd DATETIME2 NOT NULL,
    Reason NVARCHAR(1000) NULL,
    Notes NVARCHAR(2000) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Appointments_Pets_PetId FOREIGN KEY (PetId) REFERENCES dbo.Pets(PetId),
    CONSTRAINT FK_Appointments_Users_OwnerUserId FOREIGN KEY (OwnerUserId) REFERENCES dbo.Users(UserId),
    CONSTRAINT FK_Appointments_Clinics_ClinicId FOREIGN KEY (ClinicId) REFERENCES dbo.Clinics(ClinicId),
    CONSTRAINT FK_Appointments_Veterinarians_VeterinarianId FOREIGN KEY (VeterinarianId) REFERENCES dbo.Veterinarians(VeterinarianId),
    CONSTRAINT CK_Appointments_TimeRange CHECK (ScheduledEnd > ScheduledStart)
);
GO

CREATE TABLE dbo.HomeVisits (
    HomeVisitId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    AppointmentId UNIQUEIDENTIFIER NOT NULL UNIQUE,
    ServiceAddress NVARCHAR(255) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    StateProvince NVARCHAR(100) NULL,
    PostalCode NVARCHAR(20) NULL,
    Latitude DECIMAL(9,6) NULL,
    Longitude DECIMAL(9,6) NULL,
    TravelDistanceKm DECIMAL(8,2) NULL,
    TravelFee DECIMAL(10,2) NULL,
    VisitStatus NVARCHAR(20) NOT NULL CHECK (VisitStatus IN ('SCHEDULED', 'ON_ROUTE', 'ARRIVED', 'COMPLETED', 'CANCELLED')),
    ArrivalTime DATETIME2 NULL,
    CompletionTime DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_HomeVisits_Appointments_AppointmentId FOREIGN KEY (AppointmentId) REFERENCES dbo.Appointments(AppointmentId)
);
GO

CREATE TABLE dbo.MedicalRecords (
    MedicalRecordId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    PetId UNIQUEIDENTIFIER NOT NULL,
    AppointmentId UNIQUEIDENTIFIER NULL,
    VeterinarianId UNIQUEIDENTIFIER NULL,
    Diagnosis NVARCHAR(1500) NULL,
    TreatmentPlan NVARCHAR(2000) NULL,
    VaccinationDetails NVARCHAR(2000) NULL,
    LabResultsUrl NVARCHAR(500) NULL,
    FollowUpDate DATE NULL,
    RecordDate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_MedicalRecords_Pets_PetId FOREIGN KEY (PetId) REFERENCES dbo.Pets(PetId),
    CONSTRAINT FK_MedicalRecords_Appointments_AppointmentId FOREIGN KEY (AppointmentId) REFERENCES dbo.Appointments(AppointmentId),
    CONSTRAINT FK_MedicalRecords_Veterinarians_VeterinarianId FOREIGN KEY (VeterinarianId) REFERENCES dbo.Veterinarians(VeterinarianId)
);
GO

CREATE TABLE dbo.Prescriptions (
    PrescriptionId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    MedicalRecordId UNIQUEIDENTIFIER NOT NULL,
    MedicationName NVARCHAR(150) NOT NULL,
    Dosage NVARCHAR(120) NOT NULL,
    Frequency NVARCHAR(120) NOT NULL,
    DurationDays INT NULL,
    Instructions NVARCHAR(1000) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Prescriptions_MedicalRecords_MedicalRecordId FOREIGN KEY (MedicalRecordId) REFERENCES dbo.MedicalRecords(MedicalRecordId)
);
GO

CREATE TABLE dbo.ChatSessions (
    ChatSessionId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    PetId UNIQUEIDENTIFIER NULL,
    SessionStatus NVARCHAR(20) NOT NULL CHECK (SessionStatus IN ('OPEN', 'CLOSED', 'ESCALATED')),
    StartedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    EndedAt DATETIME2 NULL,
    CONSTRAINT FK_ChatSessions_Users_UserId FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId),
    CONSTRAINT FK_ChatSessions_Pets_PetId FOREIGN KEY (PetId) REFERENCES dbo.Pets(PetId)
);
GO

CREATE TABLE dbo.ChatMessages (
    ChatMessageId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    ChatSessionId UNIQUEIDENTIFIER NOT NULL,
    SenderType NVARCHAR(20) NOT NULL CHECK (SenderType IN ('OWNER', 'BOT', 'VET', 'STAFF')),
    MessageText NVARCHAR(MAX) NOT NULL,
    IsSensitive BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_ChatMessages_ChatSessions_ChatSessionId FOREIGN KEY (ChatSessionId) REFERENCES dbo.ChatSessions(ChatSessionId)
);
GO

CREATE TABLE dbo.NotificationLogs (
    NotificationId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    AppointmentId UNIQUEIDENTIFIER NULL,
    Channel NVARCHAR(20) NOT NULL CHECK (Channel IN ('EMAIL', 'SMS', 'PUSH', 'IN_APP')),
    TemplateCode NVARCHAR(80) NULL,
    DeliveryStatus NVARCHAR(20) NOT NULL CHECK (DeliveryStatus IN ('QUEUED', 'SENT', 'FAILED')),
    ErrorMessage NVARCHAR(1000) NULL,
    SentAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_NotificationLogs_Users_UserId FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId),
    CONSTRAINT FK_NotificationLogs_Appointments_AppointmentId FOREIGN KEY (AppointmentId) REFERENCES dbo.Appointments(AppointmentId)
);
GO

CREATE TABLE dbo.AuditLogs (
    AuditLogId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    ActorUserId UNIQUEIDENTIFIER NULL,
    Action NVARCHAR(120) NOT NULL,
    EntityType NVARCHAR(80) NOT NULL,
    EntityId UNIQUEIDENTIFIER NULL,
    MetadataJson NVARCHAR(MAX) NULL,
    IpAddress NVARCHAR(64) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AuditLogs_Users_ActorUserId FOREIGN KEY (ActorUserId) REFERENCES dbo.Users(UserId)
);
GO

/* Helpful indexes */
CREATE INDEX IX_Pets_OwnerUserId ON dbo.Pets(OwnerUserId);
CREATE INDEX IX_Veterinarians_ClinicId ON dbo.Veterinarians(ClinicId);
CREATE INDEX IX_Appointments_PetId ON dbo.Appointments(PetId);
CREATE INDEX IX_Appointments_OwnerUserId ON dbo.Appointments(OwnerUserId);
CREATE INDEX IX_Appointments_ClinicId_Status ON dbo.Appointments(ClinicId, Status);
CREATE INDEX IX_Appointments_VeterinarianId_ScheduledStart ON dbo.Appointments(VeterinarianId, ScheduledStart);
CREATE INDEX IX_HomeVisits_VisitStatus ON dbo.HomeVisits(VisitStatus);
CREATE INDEX IX_MedicalRecords_PetId_RecordDate ON dbo.MedicalRecords(PetId, RecordDate DESC);
CREATE INDEX IX_ChatSessions_UserId_StartedAt ON dbo.ChatSessions(UserId, StartedAt DESC);
CREATE INDEX IX_ChatMessages_ChatSessionId_CreatedAt ON dbo.ChatMessages(ChatSessionId, CreatedAt);
CREATE INDEX IX_NotificationLogs_UserId_CreatedAt ON dbo.NotificationLogs(UserId, CreatedAt DESC);
CREATE INDEX IX_AuditLogs_EntityType_EntityId ON dbo.AuditLogs(EntityType, EntityId);
GO
