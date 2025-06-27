### README: VR Gameroom

---

#### Description

VR Gameroom is a web application project built using Next.js, designed for web games and associated activities. It leverages various technologies and libraries to provide a seamless user experience.

---

#### Installation

To run this project locally, follow these steps:

1. **Clone Repository:**

   ```bash
   git clone git@github.com:monaco-gg/vr-gameroom.git
   cd vr-gameroom
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Environment Variables:**
   Create a `.env` file in the root directory and add necessary environment variables.

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

#### Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Starts the production server.
- `npm run lint`: Lints the project files.
- `npm run commit`: Commits changes using conventional commits.

---

#### Technologies & Libraries

- **Frontend:**

  - Next.js
  - React
  - Tailwind CSS
  - Styled Components
  - Framer Motion
  - React Icons
  - React Slick
  - React Toastify
  - NextAuth
  - Next PWA
  - Next SEO
  - Next Themes
  - React Input Mask
  - Kaboom
  - React Countup
  - React Lottie
  - Tailwind Datepicker React

- **State Management:**

  - Redux Toolkit
  - React Redux

- **Backend & Database:**

  - Firebase
  - Mongoose

- **Utilities:**

  - Lodash
  - Moment
  - Axios
  - Encrypt Storage
  - JS Cookie

- **Performance & Analytics:**
  - Vercel Analytics
  - Vercel Speed Insights
  - Web Vitals

---

#### Development & Tooling

- **Dev Dependencies:**
  - TypeScript
  - ESLint
  - Next.js ESLint Config
  - Autoprefixer
  - PostCSS
  - Tailwind CSS
  - CZ (Conventional Changelog)

---

**#### Cron Jobs**
The application uses two daily cron jobs, scheduled at 12:00 UTC (09:00 GMT-3 Brazil):
- `/api/users/renew-coins`: Renews user coins
- `/api/orders/batch-cancel-expired`: Batch cancel expired orders

Note: Times are in UTC. Adjust for your local timezone when necessary.

---
