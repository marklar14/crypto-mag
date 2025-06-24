# 🧠 CryptoMag – Trading Dashboard

CryptoMag is a modern Angular-based trading dashboard designed to assist cryptocurrency traders with smart tools such as a position size calculator and a trade opportunity screener.

This project uses:

- **Angular 20**
- **Tailwind CSS v3**
- **SCSS styling**
- **Husky + Commitlint for Git hooks**
- **ESLint for code quality**

---

## 🚀 Getting Started

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm start
```

Navigate to [http://localhost:4200](http://localhost:4200). The app will automatically reload on file changes.

---

## 🧪 Running Tests

Unit tests (via [Karma](https://karma-runner.github.io)):

```bash
npm test
```

Lint your code:

```bash
npm run lint
```

(Optional) Format code:

```bash
npx prettier --write .
```

---

## ⚙️ Code Generation

Generate components, services, directives, etc. using Angular CLI:

```bash
ng generate component component-name
ng generate service service-name
```

List all schematics:

```bash
ng generate --help
```

---

## 🛠 Build for Production

To build the application for production:

```bash
npm run build
```

The output will be in the `dist/` folder.

---

## 🔒 Commit Hooks & Linting

This project uses **Husky** to enforce quality:

- **Pre-commit**: Linting + tests
- **Commit message**: Checked via Commitlint

To initialize Husky manually (after `npm install`):

```bash
npm run prepare
```

---

## 🧩 Planned Features (MVP)

- ✅ Position Size Calculator
- ✅ Tailwind UI layout
- ⏳ Trade Opportunity Screener (coming soon)
- ⏳ Dark Mode Toggle
- ⏳ Realtime Signals (via WebSocket or polling)

---

## 📚 Resources

- [Angular CLI Docs](https://angular.dev/tools/cli)
- [Tailwind CSS](https://tailwindcss.com/)
- [Husky Git Hooks](https://typicode.github.io/husky/)
- [Commitlint](https://commitlint.js.org/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
