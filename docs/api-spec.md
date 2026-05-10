# Veterinary Booking System API Spec (MVP)

Base URL (example): `/api/v1`

Authentication: Bearer JWT (Azure AD B2C recommended)

## Conventions

- Content type: `application/json`
- Timestamps: ISO 8601 UTC
- Ids: UUID strings
- Common response envelope:
  - success: `{ "data": ... }`
  - error: `{ "error": { "code": "STRING_CODE", "message": "Human readable message" } }`

## Auth

### POST `/auth/register-owner`
- Role: public
- Description: Register pet owner account.
- Request:
```json
{
  "fullName": "Jane Dela Cruz",
  "email": "jane@example.com",
  "phoneNumber": "+639171112233",
  "password": "StrongPassword123!"
}
```
- Response 201:
```json
{
  "data": {
    "userId": "uuid",
    "role": "OWNER"
  }
}
```

### POST `/auth/login`
- Role: public
- Description: Login and return JWT + refresh token (or B2C token exchange).
- Request:
```json
{
  "email": "jane@example.com",
  "password": "StrongPassword123!"
}
```
- Response 200:
```json
{
  "data": {
    "accessToken": "jwt",
    "refreshToken": "token",
    "expiresIn": 3600
  }
}
```

### POST `/auth/refresh`
- Role: authenticated
- Request:
```json
{
  "refreshToken": "token"
}
```
- Response 200:
```json
{
  "data": {
    "accessToken": "new-jwt",
    "expiresIn": 3600
  }
}
```

### POST `/auth/logout`
- Role: authenticated
- Response 204

## Users

### GET `/users/me`
- Role: authenticated
- Response 200:
```json
{
  "data": {
    "userId": "uuid",
    "fullName": "Jane Dela Cruz",
    "email": "jane@example.com",
    "role": "OWNER"
  }
}
```

### PATCH `/users/me`
- Role: authenticated
- Request:
```json
{
  "fullName": "Jane D. Cruz",
  "phoneNumber": "+639171234567"
}
```
- Response 200: updated profile

## Clinics and Veterinarians

### GET `/clinics`
- Role: public
- Query params: `city`, `page`, `pageSize`, `search`
- Response 200:
```json
{
  "data": {
    "items": [
      {
        "clinicId": "uuid",
        "clinicName": "Paws & Care Clinic",
        "city": "Manila",
        "contactPhone": "+63280001111"
      }
    ],
    "page": 1,
    "pageSize": 10,
    "total": 1
  }
}
```

### GET `/clinics/{clinicId}`
- Role: public
- Response 200: clinic details

### GET `/clinics/{clinicId}/veterinarians`
- Role: public
- Response 200:
```json
{
  "data": [
    {
      "veterinarianId": "uuid",
      "fullName": "Dr. Santos",
      "specialization": "General Practice",
      "isAvailableForHomeVisit": true
    }
  ]
}
```

## Pets

### POST `/pets`
- Role: OWNER
- Description: Create pet profile.
- Request:
```json
{
  "petName": "Milo",
  "species": "Dog",
  "breed": "Shih Tzu",
  "sex": "MALE",
  "dateOfBirth": "2023-02-11",
  "weightKg": 4.5,
  "allergies": "None",
  "chronicConditions": "None"
}
```
- Response 201: created pet

### GET `/pets`
- Role: OWNER, VET, CLINIC_STAFF
- Query: `ownerUserId` (staff/vet/admin only), `page`, `pageSize`
- Response 200: paginated pets

### GET `/pets/{petId}`
- Role: OWNER (own pet), VET/STAFF with permission, ADMIN
- Response 200: pet details

### PATCH `/pets/{petId}`
- Role: OWNER (own pet), CLINIC_STAFF, ADMIN
- Response 200: updated pet

### DELETE `/pets/{petId}`
- Role: OWNER (own pet), ADMIN
- Description: Soft delete (set inactive).
- Response 204

## Appointments

### POST `/appointments`
- Role: OWNER, CLINIC_STAFF
- Request:
```json
{
  "petId": "uuid",
  "clinicId": "uuid",
  "veterinarianId": "uuid",
  "appointmentType": "HOME_VISIT",
  "scheduledStart": "2026-05-12T01:00:00Z",
  "scheduledEnd": "2026-05-12T02:00:00Z",
  "reason": "Not eating for 2 days",
  "notes": "Please call before arrival",
  "homeVisit": {
    "serviceAddress": "123 Sample St",
    "city": "Quezon City",
    "stateProvince": "NCR",
    "postalCode": "1100",
    "latitude": 14.6760,
    "longitude": 121.0437
  }
}
```
- Response 201:
```json
{
  "data": {
    "appointmentId": "uuid",
    "status": "PENDING",
    "appointmentType": "HOME_VISIT"
  }
}
```

### GET `/appointments`
- Role: OWNER, VET, CLINIC_STAFF, ADMIN
- Query:
  - `status`
  - `appointmentType`
  - `clinicId`
  - `veterinarianId`
  - `from`, `to`
  - `page`, `pageSize`
- Response 200: paginated appointments

### GET `/appointments/{appointmentId}`
- Role: authorized participants/admin
- Response 200: appointment detail

### PATCH `/appointments/{appointmentId}`
- Role: OWNER, VET, CLINIC_STAFF, ADMIN (policy-based)
- Use cases: reschedule, assign vet, update notes
- Request:
```json
{
  "scheduledStart": "2026-05-12T03:00:00Z",
  "scheduledEnd": "2026-05-12T04:00:00Z",
  "veterinarianId": "uuid",
  "notes": "Updated schedule"
}
```
- Response 200: updated appointment

### PATCH `/appointments/{appointmentId}/status`
- Role: VET, CLINIC_STAFF, ADMIN
- Request:
```json
{
  "status": "CONFIRMED"
}
```
- Response 200: updated status

### DELETE `/appointments/{appointmentId}`
- Role: OWNER (own), CLINIC_STAFF, ADMIN
- Description: cancel appointment
- Response 204

## Home Visits

### GET `/home-visits/{appointmentId}`
- Role: OWNER, assigned VET, CLINIC_STAFF, ADMIN
- Response 200:
```json
{
  "data": {
    "homeVisitId": "uuid",
    "visitStatus": "ON_ROUTE",
    "arrivalTime": null,
    "serviceAddress": "123 Sample St"
  }
}
```

### PATCH `/home-visits/{appointmentId}/status`
- Role: assigned VET, CLINIC_STAFF, ADMIN
- Request:
```json
{
  "visitStatus": "ARRIVED"
}
```
- Response 200

### PATCH `/home-visits/{appointmentId}/tracking`
- Role: assigned VET system client, CLINIC_STAFF
- Description: update ETA, location snapshot.
- Request:
```json
{
  "latitude": 14.6701,
  "longitude": 121.0389,
  "etaMinutes": 12
}
```
- Response 200

## Medical Records and Prescriptions

### POST `/medical-records`
- Role: VET, CLINIC_STAFF
- Request:
```json
{
  "petId": "uuid",
  "appointmentId": "uuid",
  "veterinarianId": "uuid",
  "diagnosis": "Mild gastritis",
  "treatmentPlan": "Oral meds for 5 days",
  "vaccinationDetails": "Updated anti-rabies",
  "labResultsUrl": "https://storage/account/container/file.pdf",
  "followUpDate": "2026-05-20"
}
```
- Response 201: created record

### GET `/pets/{petId}/medical-records`
- Role: OWNER (own pet), assigned clinic staff, VET, ADMIN
- Query: `page`, `pageSize`
- Response 200: records list

### GET `/medical-records/{medicalRecordId}`
- Role: authorized users
- Response 200: record detail

### PATCH `/medical-records/{medicalRecordId}`
- Role: VET, CLINIC_STAFF, ADMIN
- Response 200: updated record

### POST `/medical-records/{medicalRecordId}/prescriptions`
- Role: VET, CLINIC_STAFF
- Request:
```json
{
  "medicationName": "Metronidazole",
  "dosage": "50mg",
  "frequency": "Twice daily",
  "durationDays": 5,
  "instructions": "Give after meals"
}
```
- Response 201

### GET `/medical-records/{medicalRecordId}/prescriptions`
- Role: OWNER (authorized), VET, CLINIC_STAFF, ADMIN
- Response 200: prescription list

## Chatbot and Communication

### POST `/chat/sessions`
- Role: OWNER
- Request:
```json
{
  "petId": "uuid"
}
```
- Response 201:
```json
{
  "data": {
    "chatSessionId": "uuid",
    "sessionStatus": "OPEN"
  }
}
```

### POST `/chat/sessions/{chatSessionId}/messages`
- Role: OWNER, BOT service, VET, CLINIC_STAFF
- Description: send message into session; bot response can be async or immediate.
- Request:
```json
{
  "senderType": "OWNER",
  "messageText": "My cat has no appetite. What should I do?"
}
```
- Response 201:
```json
{
  "data": {
    "chatMessageId": "uuid",
    "senderType": "OWNER",
    "createdAt": "2026-05-10T17:00:00Z"
  }
}
```

### GET `/chat/sessions/{chatSessionId}/messages`
- Role: session participants, ADMIN
- Query: `page`, `pageSize`
- Response 200: message list

### PATCH `/chat/sessions/{chatSessionId}/escalate`
- Role: OWNER, BOT service, CLINIC_STAFF
- Description: escalate to clinic staff/vet.
- Response 200:
```json
{
  "data": {
    "sessionStatus": "ESCALATED"
  }
}
```

### PATCH `/chat/sessions/{chatSessionId}/close`
- Role: OWNER, CLINIC_STAFF, VET
- Response 200: closed session

## Notifications

### POST `/notifications/send`
- Role: system, CLINIC_STAFF, ADMIN
- Description: queue/send notification via email/SMS/push.
- Request:
```json
{
  "userId": "uuid",
  "appointmentId": "uuid",
  "channel": "SMS",
  "templateCode": "APPOINTMENT_REMINDER"
}
```
- Response 202:
```json
{
  "data": {
    "notificationId": "uuid",
    "deliveryStatus": "QUEUED"
  }
}
```

### GET `/notifications`
- Role: OWNER (own), STAFF, ADMIN
- Query: `userId`, `deliveryStatus`, `page`, `pageSize`
- Response 200: notification logs

## Admin and Auditing

### GET `/audit-logs`
- Role: ADMIN
- Query: `entityType`, `entityId`, `actorUserId`, `from`, `to`, `page`, `pageSize`
- Response 200: paginated audit entries

### GET `/reports/appointments/summary`
- Role: ADMIN, CLINIC_STAFF
- Query: `clinicId`, `from`, `to`
- Response 200:
```json
{
  "data": {
    "totalAppointments": 120,
    "completed": 98,
    "cancelled": 12,
    "noShow": 10
  }
}
```

## Health and Ops

### GET `/health`
- Role: public
- Response 200:
```json
{
  "service": "vet-booking-backend",
  "status": "ok"
}
```

## HTTP Status Guide

- `200` success
- `201` created
- `202` accepted for async processing
- `204` no content
- `400` validation error
- `401` unauthorized
- `403` forbidden
- `404` not found
- `409` conflict (e.g., booking slot already taken)
- `422` business rule violation
- `500` internal server error

## Validation Rules (Core)

- `scheduledEnd` must be greater than `scheduledStart`
- `HOME_VISIT` appointments require `homeVisit` payload
- Pet owner can only book/manage own pets
- Only assigned vet/staff can mark visit statuses like `ON_ROUTE` and `ARRIVED`
- Medical records are writable by vet/staff; owners have read-only access
- Chatbot should include safety disclaimer and emergency escalation path
