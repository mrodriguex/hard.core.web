# HARDCORE Mobile

Mobile app generated from `hardcore-web`, focused on phone-first UX with React Native + Expo.

## Features

- Login with HARD.CORE API token flow.
- Persistent session with `AsyncStorage`.
- Mobile navigation with bottom tabs.
- Entity listing screens for:
  - Empresas
  - Menús
  - Clientes
  - Perfiles
  - Usuarios
- Shared API envelope handling: `{ success, data, message, errors }`.

## Stack

- Expo (React Native)
- React Navigation
- Axios
- AsyncStorage

## Run

```bash
cd hardcore-mobile
npm install
npm run start
```

Open with Expo Go (Android/iOS) or use emulator.

## Project structure

```text
hardcore-mobile/
├── App.js
├── index.js
└── src/
    ├── components/
    │   └── EntityListScreen.js
    ├── context/
    │   └── AuthContext.js
    ├── navigation/
    │   └── AppNavigator.js
    ├── screens/
    │   ├── LoginScreen.js
    │   ├── EmpresasScreen.js
    │   ├── MenusScreen.js
    │   ├── ClientesScreen.js
    │   ├── PerfilesScreen.js
    │   └── UsuariosScreen.js
    └── services/
        ├── apiClient.js
        ├── authService.js
        ├── empresaService.js
        ├── menuService.js
        ├── clienteService.js
        ├── perfilService.js
        └── usuarioService.js
```

## Notes

- API base URL is currently `https://hardcoreapi.hookhub.app`.
- You can move it to env config later if needed.
- Current screens are list-oriented (optimized for mobile browsing); CRUD forms can be added incrementally.
