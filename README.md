# PGA 2K25 Match Tracker

A sophisticated web application built to track and analyze PGA 2K25 ranked matchmaking games. This project provides detailed statistics and historical data for matches, teams, and courses, offering insights into gaming performance and trends.

## 🎯 Project Overview

PGA 2K25 Match Tracker is a personal project designed to maintain a comprehensive record of ranked matchmaking games between friends. It goes beyond simple match tracking by providing detailed statistics and analytics for teams, players, and courses, helping to identify patterns and improve gameplay strategies.

> **This project is archived.** The site now runs as a read-only snapshot of the matches played from March to May 2025. The original Supabase database and sign-in have been retired, and the data ships with the site as JSON. The admin data entry forms are still in the code, but aren't reachable on the site.

## ✨ Features

- **Match History Tracking**
  - Detailed record of all played matches
  - Individual match details and statistics
  - Historical performance data

- **Team Analytics**
  - Comprehensive team/player listings
  - Team-based performance metrics
  - Player statistics and trends

- **Course Insights**
  - Database of all played courses
  - Course-specific statistics
  - Performance analysis by course

- **Modern User Experience**
  - Clean, intuitive interface
  - Responsive design
  - Seamless data interactions
  - Robust validation and loading states

## 🛠️ Tech Stack

- **Frontend Framework**
  - Next.js 15
  - React 19
  - TypeScript

- **Styling**
  - TailwindCSS
  - Next Themes (for theme management)

- **Data**
  - Next.js API routes serving a JSON snapshot
  - Originally backed by Supabase (Postgres and Auth)

- **Development Tools**
  - ESLint
  - PostCSS
  - TurboRepo

## 🚀 Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pga2k-tracker.git
   cd pga2k-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## 📁 Code Structure

```
src/
├── app/              # Next.js app router pages and layouts
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Core utilities and configurations
├── types/           # TypeScript type definitions
└── utils/           # Helper functions and utilities
```

## 🔧 Data

The site reads from the JSON files in `src/lib/data/snapshot/`, so it needs no database or environment variables. They were generated from the final Supabase table exports with `scripts/export-db-dump.mjs`.

Some courses were entered with filler distances or pars. The snapshot keeps those values as exported, and `src/lib/courseService.ts` hides them on the site.

## 🤝 Contributing

While this is primarily a personal project, suggestions and feedback are welcome. Feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

Ryan Kadlick

## 📸 Screenshots

[Screenshots coming soon]

---

*Note: This project is primarily for personal use and demonstration purposes. It showcases modern web development practices, clean code architecture, and effective state management in a real-world application.*
