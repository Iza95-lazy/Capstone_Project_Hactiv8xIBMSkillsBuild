# 💰 FinTrack: Personal & Business Expense Analyzer Dashboard

> A modern, responsive, and interactive financial dashboard built as a Capstone Project for Hacktiv8 x IBM SkillsBuild. Designed to track, analyze, and manage personal and business cash flows with zero external frameworks.

---

## 🚀 Overview
**FinTrack** is a lightweight yet powerful dashboard application that helps users gain deep visibility into their financial status. Built with strict prompt engineering methodologies (3-layer prompting) and pure native web technologies, it features automated KPI calculations, interactive category breakdowns, budget goal tracking, and dynamic transaction filtering for a 100-row expense dataset.

---

## ✨ Key Features
* **📊 Dynamic KPI Cards:** Real-time calculation of *Total Spend*, *Monthly Budget*, *Remaining Budget*, and *Overspending Alert Count*.
* **📈 Expense Breakdown & Budget Tracker:** Visual categorization of expenses with custom progress bars and threshold warnings.
* **🔍 Interactive Filtering & Search:** Real-time search by transaction description/category and dynamic dropdown category filters.
* **⚡ 100-Row Dataset Integration:** Pre-loaded with realistic personal and business transaction records in Indonesian Rupiah (`IDR`).
* **🎨 Modern UI / UX:** Dark-mode slate aesthetics (`#0F172A`), clean borders, and soft shadows built specifically for financial management.

---

## 🛠️ Tech Stack
This project is engineered using **Vanilla Web Technologies** (No external frameworks or libraries used):
* **HTML5** (Semantic structure & App Shell architecture)
* **CSS3** (Custom Properties, Flexbox, CSS Grid, Responsive Design)
* **JavaScript (ES6+ / DOM Manipulation)** (State management, event listeners, dynamic data filtering, and formatting)

---

## 📁 Project Structure
```text
Capstone_Project_DzakyRafifAriza/
│
├── index.html       # Main HTML application structure & App Shell
├── style.css        # Comprehensive styling, variables, and responsive layout
├── script.js        # Core logic, dataset generator, filters, and DOM rendering
└── dataset_*.csv    # 100-row sample dataset for tracking expenses

🤖 3-Layer Prompt Engineering Architecture
This dashboard was developed by instructing an AI Agent using a structured 3-layer prompt system:

Layer 1 (Role & Context): Defined the AI persona as a Senior Frontend Engineer and set strict constraints (Vanilla HTML/CSS/JS only, multi-file structure).

Layer 2 (Task & Requirements): Outlined specific component requirements (KPI cards, sidebar, search input, data table rendering, 100-row records).

Layer 3 (Constraints & Output): Enforced color palettes (#0F172A, #F59E0B, #6366F1), clean DOM code, and zero console errors.

💡 Future Enhancements
1. Optical Character Recognition (OCR) for auto-scanning receipt photos.

2. Direct API integration with banks and e-wallets.

3. Predictive financial analytics using Machine Learning.