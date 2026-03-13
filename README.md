# hard.core.web

Frontend web application for HARD.CORE API, built with React + Vite.

## Repository purpose

This repository contains the UI layer of the HARD.CORE platform and focuses on:

- Authentication flow (`Login` + token persistence).
- CRUD administration screens for core entities:
	- `Empresas`
	- `Menús`
	- `Clientes`
	- `Perfiles`
	- `Usuarios`
- Integration with the backend API envelope format:
	- `{ success, data, message, errors }`

## Repository layout

```text
hard.core.web/
├── .git/
├── LICENSE
├── README.md                  # This file (root documentation)
└── hardcore-web/              # React application root
		├── package.json
		├── vite.config.js
		├── src/
		│   ├── App.jsx
		│   ├── components/
		│   ├── pages/
		│   └── services/
		└── public/
```

> Important: the real app root is `hardcore-web/`.

## Tech stack

- React 19
- Vite 8
- Axios
- TailwindCSS 4
- ESLint 9

## Prerequisites

- Node.js 20+
- npm 10+

## Quick start

From repository root:

```bash
cd hardcore-web
npm install
npm run dev
```

Default local URL:

- `http://localhost:5173`

## Available scripts

Run inside `hardcore-web/`:

- `npm run dev` → start dev server
- `npm run build` → production build
- `npm run preview` → preview production build
- `npm run lint` → lint source code

## Application architecture

### 1) UI and navigation

- `src/App.jsx` controls session state and active section.
- `src/components/Navbar.jsx` provides section navigation and logout.
- `src/pages/*` contains entity-specific views.

### 2) Service layer

- `src/services/authService.js` handles login, token storage, and logout.
- `src/services/*Service.js` files encapsulate API calls by entity.
- Each service:
	- Uses Axios instance with API base URL.
	- Injects `Authorization: Bearer <token>` via interceptor.
	- Unwraps the backend envelope and throws on `success: false`.

### 3) Auth model

- JWT token is persisted in `localStorage` under key `token`.
- `logout()` removes local token.
- Current UI gate is local-state based (`loggedIn` state in `App.jsx`).

## API integration notes

- Base URL currently hardcoded in service files:
	- `https://hardcoreapi.hookhub.app`
- Login endpoint:
	- `POST /api/v1/Auth/login`
- Main domain endpoints follow:
	- `GET /api/v1/<Entity>/GetAll`
	- `GET /api/v1/<Entity>/GetById`
	- `POST /api/v1/<Entity>/Add`
	- `PUT /api/v1/<Entity>/Update`
	- `DELETE /api/v1/<Entity>/Delete`

## Debugging guide

### Frequent issue: `ENOENT: uv_cwd`

Cause: terminal is located in a deleted directory.

Fix:

```bash
cd ~/Documentos/Development/DevOps/hard.core.web/hardcore-web
npm run dev
```

### Port already in use

- Stop the previous Vite process or run on another port:

```bash
npm run dev -- --port 5174
```

### API/auth issues

- Open browser DevTools → Network tab.
- Verify `Authorization` header is present on protected routes.
- Confirm login response contains `success: true` and token in `data`.

## Build and release

```bash
cd hardcore-web
npm run lint
npm run build
npm run preview
```

Build output is generated in `hardcore-web/dist/`.

## Contribution guidelines

1. Create a feature branch from `main`.
2. Keep PRs focused (single concern).
3. Run lint and build before opening PR.
4. Include screenshots for UI-impacting changes.
5. Document API contract changes in the PR description.

Recommended branch naming:

- `feature/<short-name>`
- `fix/<short-name>`
- `chore/<short-name>`

## Maintenance notes

- Keep dependencies current (`npm outdated`).
- Prefer centralizing API base URL in environment variables (`VITE_API_URL`) for multi-environment deployments.
- Consider consolidating duplicated Axios setup into a shared API client module.
- Review token handling and add route guards if protected routes grow.

## Security considerations

- Do not commit secrets in source files.
- Prefer environment variables for sensitive/variable configuration.
- Validate backend error handling to avoid exposing internal messages in UI.

## License

This project is distributed under the MIT License. See `LICENSE`.

## Maintainer

- Repository owner / core maintainer: Manuel Rodríguez

If you plan larger architectural changes, open an issue first with context, goals, and migration impact.
