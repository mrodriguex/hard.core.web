
# HARD.CORE.WEB - React Frontend Base (NOT an ERP)

⚠️ **IMPORTANT**: This repository is a **frontend base implementation** for HARD.CORE platform integrations. It is intended as a reusable UI foundation for React-based web projects, not a full ERP. It may require environment-specific customization before production use.

## 📋 Table of Contents

- [About This Base Project](#about-this-base-project)
- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Build Instructions](#build-instructions)
- [Running the Application](#running-the-application)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About This Base Project

**HARD.CORE.WEB** is a reusable React-based frontend base for web projects that connect to the HARD.CORE API. It is not a full ERP, but a starting point for custom admin panels, dashboards, or management UIs.

### Purpose of This Base Code

This codebase provides:

- ✅ Authentication flow (login/logout with token persistence)
- ✅ Responsive admin UI with desktop and mobile navigation
- ✅ CRUD-ready modules for core entities (Empresas, Menús, Clientes, Perfiles, Usuarios, **Mensajes**)
- ✅ Shared service pattern for REST integration
- ✅ Axios-based token interceptor and envelope unwrapping
- ✅ Vite-based modern build and deployment flow

### Intended Use

- Template for new React frontend projects over HARD.CORE API
- Reference implementation for service-layer integration patterns
- Starting point for custom admin panels, dashboards, or management modules

### NOT Intended As

- ❌ A complete feature-finished ERP product
- ❌ A no-customization production package
- ❌ A backend/API replacement

---

## 🎯 Project Overview

This project is the web presentation layer for HARD.CORE and currently includes UI modules for:

- Empresas
- Menús
- Clientes
- Perfiles
- Usuarios
- **Mensajes**

The frontend consumes API responses using the envelope contract:

```json
{
	"success": true,
	"data": {},
	"message": "...",
	"errors": []
}
```

---

## ✨ Features

### Core Functionality

- JWT login and session handling
- Dynamic section navigation via top navbar
- Entity list and management flows
- Basic filtering and pagination patterns
- Mobile improvements including hamburger navigation

### API Integration Features

- Shared Axios clients per domain service
- Automatic `Authorization: Bearer <token>` attachment
- Consistent error extraction from API envelope
- Modular service files for each domain entity

---

## 🛠️ Technology Stack

### Frontend

- React 19
- Vite 8
- TailwindCSS 4
- Axios

### Tooling

- Node.js 20+
- npm 10+
- ESLint 9

---

## 🏗️ Project Architecture

### Layered Frontend Structure

```
┌──────────────────────────────────────────────┐
│ UI Layer                                     │
│ (pages, components, visual state)            │
└──────────────────────────────────────────────┘
											↓
┌──────────────────────────────────────────────┐
│ App State / Session Layer                    │
│ (App.jsx, login gate, navigation state)      │
└──────────────────────────────────────────────┘
											↓
┌──────────────────────────────────────────────┐
│ Service Layer                                │
│ (authService + entity services with Axios)   │
└──────────────────────────────────────────────┘
											↓
┌──────────────────────────────────────────────┐
│ HARD.CORE API                                │
│ (REST endpoints v1)                          │
└──────────────────────────────────────────────┘
```

### Module Descriptions

- `src/App.jsx`: auth gate and current section routing
- `src/components/Navbar.jsx`: responsive menu + logout
- `src/pages/*`: feature pages per entity
- `src/services/*`: API communication and envelope handling

---

## 📁 Folder Structure

```text
hard.core.web/
├── LICENSE
├── README.md
├── docs/                            # static published output (if used)
├── hardcore-mobile/                 # optional mobile client (Expo)
└── hardcore-web/                    # main React web application
		├── package.json
		├── vite.config.js
		├── public/
		└── src/
				├── App.jsx
				├── components/
				├── pages/
				└── services/
```

---

## 📋 Prerequisites

- Node.js 20 or later
- npm 10 or later
- Access to HARD.CORE API endpoint

---

## 📦 Installation

```bash
git clone https://github.com/mrodriguex/hard.core.web.git
cd hard.core.web/hardcore-web
npm install
```

---

## 🔨 Build Instructions

```bash
cd hardcore-web
npm run lint
npm run build
```

Build artifacts are generated in `hardcore-web/dist`.

---

## 🚀 Running the Application

```bash
cd hardcore-web
npm run dev
```

Default URL:

- `http://localhost:5173`

Preview production build locally:

```bash
npm run preview
```

---

## ⚙️ Configuration

### API Base URL

Current service files target:

- `https://localhost:7026`

Recommended enhancement:

- Move base URL to env config (`VITE_API_URL`) for multi-environment deploys.

### Authentication

- Token key in browser storage: `token`
- Header used: `Authorization: Bearer {token}`

---

## 📚 API Documentation

### Authentication Endpoint

- `POST /api/v1/Auth/login`

### Common Entity Endpoints

- `GET /api/v1/<Entity>/GetAll`
- `GET /api/v1/<Entity>/GetById`
- `POST /api/v1/<Entity>/Add`
- `PUT /api/v1/<Entity>/Update`
- `DELETE /api/v1/<Entity>/Delete`

Entities implemented in UI:

- Empresa, Menu, Cliente, Perfil, Usuario, **Mensajes**

---

## 🚢 Deployment

### Web Build Deployment

```bash
cd hardcore-web
npm run build
```

Deploy contents of `dist/` to your static hosting platform.

If publishing to repository docs site, copy generated output to `docs/` according to your release workflow.

---

## 🐛 Troubleshooting

### 1) `ENOENT: uv_cwd`

Cause: terminal still points to a deleted directory.

Fix:

```bash
cd ~/Documentos/Development/DevOps/hard.core.web/hardcore-web
npm run dev
```

### 2) Port already in use

```bash
npm run dev -- --port 5174
```

### 3) API unauthorized errors

- Verify token exists in storage
- Confirm `Authorization` header is present
- Validate login response includes token in `data`

---

## 👥 Contributing

1. Fork the repository
2. Create branch: `feature/<name>` or `fix/<name>`
3. Keep changes focused and documented
4. Run lint and build before PR
5. Open PR with context and screenshots for UI changes

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE).

---

## 📞 Support & Contact

- Repository owner: Manuel Rodríguez
- Main repository: https://github.com/mrodriguex/hard.core.web

---

**Project Type**: Frontend BASE SOURCE CODE
**Maintained By**: Manuel Rodríguez
**Status**: Active
