# Server Import / Export

## 1. Configure the API address

Create a `.env` file in the project root (copy `.env.example`) and set the base URL of your backend:

```env
EXPO_PUBLIC_API_BASE_URL=https://your-api-host.example
```

Use the base URL only; do not append `/putContactSaving` or `/getContactSaving`. Restart Expo after changing `.env`:

```bash
npx expo start -c
```

## 2. Requests used by the app

- Export: `PUT /putContactSaving` with JSON `{ savingName, savingPassword, contacts }`.
- Import: `POST /getContactSaving` with JSON `{ SavingName, SavingPassword }`.

The import uses POST so the password is not included in the URL/query string. Export handles both `201 Created: true` and `200 Created: false`; the UI reports whether the backup was created or overwritten. HTTP 400, 403 and 404 errors are displayed using the server's JSON `error` message when provided.

The app validates the documented field constraints before export and validates returned contacts before replacing the local SQLite list. Server-side validation and password checks remain authoritative.
