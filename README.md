Dr. Basma Mental Care

**Dr. Basma Mental Care** is a web platform dedicated to providing mental health support through online session booking, user profiles, digital payments, and administrative tools for mental health professionals. This application was developed as a modern, responsive, and scalable mental health care platform using **React**, **Vite**, **Firebase**, and **Tailwind CSS**.

---
## Dr. Basma Mental Care Project Link

**URL**: https://lovable.dev/projects/92a1247e-da3a-45be-a0e8-3a3098f0bf37

## 🌟 Features

### 🧑‍⚕️ For Patients:
- Register and log in securely
- View available mental health services
- Book sessions with professionals
- Manage bookings and sessions
- Make online payments

### 👩‍⚕️ For Doctors:
- Create and update personal profile and specialties
- Approve or reject session bookings
- View and manage patient schedules

### 🛠️ Admin Panel:
- Manage doctor accounts
- Track sessions
- Monitor payment and wallet status

---

## 🧰 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Authentication & Database**: Firebase Authentication + Firestore
- **Routing**: React Router
- **Deployment**: GitHub Pages / Firebase Hosting

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 16
- NPM or Yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nohahatem24/dr-basma-mentalcare.git
   cd dr-basma-mentalcare
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open your browser at [http://localhost:5173](http://localhost:5173)

---

## 🗃️ Project Structure

```bash
├── public
├── src
│   ├── components     # Shared UI components
│   ├── pages          # Main page views (Home, Login, Register, etc.)
│   ├── context        # Auth and global context
│   ├── firebase       # Firebase configuration
│   └── styles         # Tailwind & custom styles
├── vite.config.ts     # Vite configuration
├── tailwind.config.js # Tailwind configuration
└── package.json
```

---

## ⚠️ Known Issues

* Booking and payment validation needs enhancement.
* Data (user input like age, reason, preferred session time) isn't currently saved.
* Session confirmation may proceed even if payment fails or user input is incomplete.

### ✅ Planned Fixes:

* Add validation for all booking form fields
* Ensure wallet deduction only happens after valid input & successful payment
* Improve session booking logic and payment feedback

---

## 🤝 Contributing

Contributions are welcome! If you'd like to suggest a fix or feature:

1. Fork the repo
2. Create a new branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to your branch (`git push origin feature-name`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 📬 Contact

**Developer:** Noha Hatem
**GitHub:** [@nohahatem24](https://github.com/nohahatem24)

For suggestions or collaboration opportunities, feel free to reach out via GitHub.

```

