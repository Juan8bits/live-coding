# Prueba técnica: Backend NestJS

API de una clínica para gestionar **pacientes**, **médicos** y **citas**. La persistencia está simulada en memoria (`src/database/in-memory-database.ts`).

No necesitas instalar ni ejecutar nada: la prueba consiste en leer y escribir código. Piensa en voz alta; nos interesa tanto tu razonamiento como el código.

```
src/
├── appointments/    # Citas
├── doctors/         # Médicos
├── patients/        # Pacientes
├── database/        # "Base de datos" en memoria
└── common/utils/    # Utilidades compartidas
```

---

## Parte 1: corregir incidentes (≈12 min)

Soporte reportó estos problemas. Encuentra la causa en el código y corrígela.

1. `GET /patients/5` responde con error 500, aunque el paciente 5 existe.
2. `GET /appointments/doctor/3` devuelve `"appointments": {}`, aunque el médico 3 tiene citas.
3. `GET /appointments` es lento y empeora a medida que crece la base. ¿Cómo lo mejorarías?

## Parte 2: nuevas funcionalidades (≈15 min)

### 2.1 Buscar pacientes por email

```
GET /patients/search?email=garcia
GET /patients/search?email=jorge.garcia.1@mail.com&exact=true
```

- Por defecto busca por **similitud**: pacientes cuyo email contiene el texto, sin distinguir mayúsculas de minúsculas.
- Con `exact=true` busca por **igualdad**.
- Devuelve el mismo formato que `GET /patients`.
- Si no se envía `email`, responde 400.

### 2.2 Nueva entidad: Profesional

Crea el módulo de **profesionales de la salud** (enfermería, nutrición, psicología, etc.). Puedes guiarte por los módulos existentes.

| Campo           | Tipo      | Notas                                  |
| --------------- | --------- | -------------------------------------- |
| `id`            | `number`  | Autogenerado                           |
| `fullName`      | `string`  | Obligatorio                            |
| `profession`    | `string`  | Obligatorio                            |
| `licenseNumber` | `string`  | Obligatorio y **único**                |
| `email`         | `string`  | Obligatorio y con formato válido       |
| `active`        | `boolean` | `true` al crearlo                      |
| `createdAt`     | `Date`    | Automático                             |

Endpoints:

- `POST /professionals`: crea un profesional. Si el `licenseNumber` ya existe, responde 409.
- `GET /professionals`: lista todos.
- `GET /professionals/:id`: detalle. Si no existe, responde 404.
