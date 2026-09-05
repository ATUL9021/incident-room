#folder structure
very nice md
src/
│
├── modules/
│ │
│ ├── auth/
│ │ ├── auth.routes.js
│ │ ├── auth.controller.js
│ │ ├── auth.service.js
│ │ ├── auth.repository.js
│ │ ├── auth.validation.js
│ │ └── auth.types.js
│ │
│ ├── organizations/
│ │ ├── organization.routes.js
│ │ ├── organization.controller.js
│ │ ├── organization.service.js
│ │ ├── organization.repository.js
│ │ ├── organization.validation.js
│ │ └── organization.types.js
│ │
│ ├── memberships/
│ │ ├── membership.routes.js
│ │ ├── membership.controller.js
│ │ ├── membership.service.js
│ │ ├── membership.repository.js
│ │ └── membership.validation.js
│ │
│ ├── services/
│ │ ├── service.routes.js
│ │ ├── service.controller.js
│ │ ├── service.service.js
│ │ ├── service.repository.js
│ │ └── service.validation.js
│ │
│ └── incidents/
│ ├── incident.routes.js
│ ├── incident.controller.js
│ ├── incident.service.js
│ ├── incident.repository.js
│ ├── incident.validation.js
│ └── incident.types.js
│
├── middleware/
│ ├── auth.middleware.js
│ ├── error.middleware.js
│ └── ...
│
├── database/
│ ├── connection.js
│ └── migrations/
│
├── config/
│ └── ...
│
├── utils/
│ └── ...
│
├── app.js
└── server.js
