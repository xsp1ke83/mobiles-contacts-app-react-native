# Contacts App

Навчальний мобільний застосунок для керування контактами на React Native + Expo + TypeScript.

## Можливості

- Перегляд контактів та пошук за ім'ям, прізвищем або номером телефону.
- Створення, перегляд, редагування та видалення контактів.
- Локальне збереження в SQLite — дані залишаються після перезапуску застосунку.
- Імпорт та експорт контактів у JSON.
- UI для серверного імпорту/експорту за назвою збереження та паролем.
- Світла, темна та системна тема.
- Bottom navigation: Contacts / Settings.

## Запуск

Потрібен Node.js (рекомендовано актуальний LTS) та Expo Go або емулятор Android/iOS.

```bash
npm install
npx expo install --fix
npx expo start
```

Далі відскануйте QR-код через Expo Go або натисніть `a` / `i` для запуску емулятора.

> Після `npx expo install --fix` Expo підбере сумісні версії native-пакетів для встановленого SDK. Якщо створюєте новий проєкт із нуля, можна також почати з `npx create-expo-app@latest`.

## JSON формат

Імпорт очікує масив об'єктів:

```json
[
  {
    "firstName": "John",
    "lastName": "Snow",
    "mobilePhone": "380987867518",
    "notes": "Don't answer!"
  },
  {
    "firstName": "Igor",
    "lastName": "Cool",
    "mobilePhone": "380987757512",
    "notes": null
  }
]
```

Імпорт повністю замінює поточний локальний список. Перед фактичним записом користувач бачить підтвердження. Формат перевіряється до заміни бази.

## Підключення Server API

Відкрийте `services/serverBackupService.ts` і задайте:

```ts
const API_BASE_URL = 'https://your-api.example.com';
```

Реалізовані контракти:
- `PUT /putContactSaving` — body: `{ savingName, savingPassword, contacts }`.
- `GET /getContactSaving?SavingName=...&SavingPassword=...`.

Клієнт очікує успішний HTTP status для PUT та JSON `{ savingName, contacts }` для GET. У разі помилки показується повідомлення. Сервер має перевіряти пароль і не дозволяти перезапис збереження з неправильним паролем.

**Важливо для production:** не передавайте пароль через GET query string, якщо є можливість змінити API. URL може потрапити в серверні логи, історію та аналітику. Краще використовувати POST body або заголовок авторизації, HTTPS і належне хешування паролів на сервері.

## Структура

```text
app/
  (tabs)/              # Contacts та Settings, bottom navigation
  contact/             # Створення та деталі/редагування контакту
components/             # Повторно використовувані UI-компоненти
constants/              # Кольори тем
context/                # Спільний стан контактів і теми
database/               # SQLite та repository-функції
services/               # Бізнес-логіка, JSON та server API
types/                  # TypeScript типи
```

## Навчальні акценти

1. `database/database.ts` — SQL schema та CRUD.
2. `context/AppContext.tsx` — спільний стан і синхронізація UI після CRUD.
3. `services/importExportService.ts` — робота з файловою системою та валідація JSON.
4. `services/serverBackupService.ts` — ізольований HTTP-клієнт для backend.
5. `app/(tabs)/index.tsx` — пошук і фільтрація контактів.
6. `BackupModal.tsx` — UX для серверного імпорту/експорту та попередження перед заміною даних.

## Примітки

- На цьому етапі серверні запити описані, але потребують налаштування `API_BASE_URL` і доступного backend.
- Локальний імпорт та експорт працюють окремо від сервера.
- Контакти зберігаються в базі SQLite у sandbox застосунку, а не синхронізуються з системною телефонною книгою.
