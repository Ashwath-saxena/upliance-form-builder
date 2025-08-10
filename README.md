# Upliance.ai Form Builder

A dynamic, fully featured form builder created for the upliance.ai Associate Software Developer assignment. Build, preview, and manage forms with ease using modern React, TypeScript, Redux Toolkit, and Material-UI.

---

## 🚀 Live Demo

[Deployed Application](https://upliance-form-builder-chi.vercel.app/)

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **State Management:** Redux Toolkit
- **UI Framework:** Material-UI (MUI)
- **Storage:** localStorage (browser)
- **Build Tool:** Vite
- **Deployment:** Vercel

---

## ✨ Features

### 🏗️ Form Builder (`/create`)
- **7 Field Types:** Text, Number, Textarea, Select, Radio, Checkbox, Date
- **Configurable Fields:** Label, Required, Default value
- **Advanced Validation:** Min/max length, Email, Password
- **Derived Fields:** Create computed fields using formulas (e.g., Age from Date of Birth)
- **Field Reordering/Deleting:** Drag-drop reordering, safe deletion with dependency checks
- **Persistence:** Save forms to localStorage

### 👀 Form Preview (`/preview`)
- **Interactive Forms:** Real-time rendering of built forms
- **Validation Feedback:** Inline error messages for all rules
- **Auto-Updating Derived Fields:** Computed values update automatically
- **Submission:** Full validation before submit
- **"Validate All" Button:** Check all fields at once

### 📂 My Forms (`/myforms`)
- **Saved Forms List:** Browse all forms saved in localStorage
- **Metadata:** See form name and creation date
- **Quick Navigation:** Open form directly in preview mode

---

## 🎯 Assignment Requirements Fulfilled

- ✅ All 7 field types implemented
- ✅ Full field configuration options
- ✅ All validation rules (required, length, email, password)
- ✅ Derived fields with parent selection & formulas
- ✅ Field management (reorder, delete with dependency checks)
- ✅ Form saving (localStorage)
- ✅ Interactive preview with validation
- ✅ Saved forms management UI

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ and **npm**

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/upliance-form-builder.git
cd upliance-form-builder
npm install
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## 📱 Features Showcase

- **Responsive UI:** Works on mobile and desktop
- **Theme Support:** Light & dark mode toggle
- **Modern UI:** Glassmorphism, smooth animations
- **Type Safety:** 100% TypeScript
- **Comprehensive Validation:** Robust error handling and feedback
- **Accessibility:** ARIA support, full keyboard navigation

---

## 🏗️ Project Structure

```
src/
├── components/   # Reusable UI components
├── features/     # Redux slices & feature modules
├── pages/        # Route-level components
├── utils/        # Utility functions & types
├── hooks/        # Custom React hooks
└── app/          # Redux store configuration
```

---

## 📄 License

This project was created exclusively for the upliance.ai Associate Software Developer assignment.

---

**Developed by:** [Ashwath Saxena]  
**Assignment:** upliance.ai Associate Software Developer
