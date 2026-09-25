# Technical interview: NestJS backend

A clinic API that manages **patients**, **doctors** and **appointments**. Persistence is simulated in memory (`src/database/in-memory-database.ts`).

You don't need to install or run anything: this exercise is about reading and writing code. Please think out loud; we care about your reasoning as much as the code.

```
src/
├── appointments/    # Appointments
├── doctors/         # Doctors
├── patients/        # Patients
├── database/        # In-memory "database"
└── common/utils/    # Shared utilities
```

---

## Part 1: fix the incidents (~12 min)

Support reported the following issues. Find the cause in the code and fix it.

1. `GET /patients/5` returns a 500 error, even though patient 5 exists.
2. `GET /appointments/doctor/3` returns `"appointments": {}`, even though doctor 3 has appointments.
3. `GET /appointments` is slow and gets worse as the database grows. How would you improve it?

## Part 2: new features (~15 min)

### 2.1 Search patients by email

```
GET /patients/search?email=garcia
GET /patients/search?email=jorge.garcia.1@mail.com&exact=true
```

- By default it searches by **similarity**: patients whose email contains the text, case-insensitive.
- With `exact=true` it searches for an **exact match**.
- Returns the same format as `GET /patients`.
- If `email` is not provided, respond with 400.

### 2.2 New entity: Professional

Create the **healthcare professionals** module (nursing, nutrition, psychology, etc.). Feel free to use the existing modules as a guide.

| Field           | Type      | Notes                           |
| --------------- | --------- | ------------------------------- |
| `id`            | `number`  | Auto-generated                  |
| `fullName`      | `string`  | Required                        |
| `profession`    | `string`  | Required                        |
| `licenseNumber` | `string`  | Required and **unique**         |
| `email`         | `string`  | Required, valid email format    |
| `active`        | `boolean` | `true` on creation              |
| `createdAt`     | `Date`    | Set automatically               |

Endpoints:

- `POST /professionals`: creates a professional. If the `licenseNumber` already exists, respond with 409.
- `GET /professionals`: lists all professionals.
- `GET /professionals/:id`: returns one professional. If it doesn't exist, respond with 404.
