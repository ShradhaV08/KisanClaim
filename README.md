<p align="center">
  <img src="https://img.shields.io/badge/🌾_KisanClaim-Agricultural_Insurance-166534?style=for-the-badge&labelColor=0d3320" alt="KisanClaim" />
</p>

<h1 align="center">KisanClaim 🌾</h1>

<p align="center">
  <strong>AI-Powered Crop Insurance Intelligence Platform for Indian Farmers</strong>
</p>

<p align="center">
  <a href="https://kisan-claim.vercel.app">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-kisan--claim.vercel.app-00C853?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Python-ML_Backend-3776AB?style=flat-square&logo=python" alt="Python ML" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License" />
</p>

---

## 🚀 What is KisanClaim?

**KisanClaim** is a full-stack InsurTech platform that revolutionizes crop insurance for India's 150M+ farming households. Built as part of the **PMFBY (Pradhan Mantri Fasal Bima Yojana)** ecosystem, it combines cutting-edge **AI/ML fraud detection**, an intelligent **chatbot advisor (KisanMitra)**, and a sleek multilingual interface — all running **100% offline** with zero external dependencies.

> 🎯 **Mission:** Make crop insurance accessible, transparent, and fraud-resistant for every Indian farmer.

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🤖 AI-Powered Intelligence
- **Smart Plan Recommendations** — ML-driven suggestions based on crop type, region & risk profile
- **Fraud Detection Scoring** — Real-time anomaly detection on claim submissions
- **Photo Verification** — AI-based crop damage image validation
- **Pattern Detection** — Historical claim pattern analysis

</td>
<td width="50%">

### 🛡️ Insurance Operations
- **Plan Browsing & Comparison** — Side-by-side plan analysis
- **Premium Quote Calculator** — Instant premium estimation
- **One-Click Policy Purchase** — Streamlined enrollment
- **Digital Claim Filing** — Submit & track claims online

</td>
</tr>
<tr>
<td width="50%">

### 💬 KisanMitra Chatbot
- **Multilingual AI Assistant** — Answers farmer queries in natural language
- **Claim Guidance** — Step-by-step help for filing claims
- **Policy Advisor** — Personalized insurance recommendations
- **24/7 Availability** — Always-on support

</td>
<td width="50%">

### 📊 Dashboards & Admin
- **Farmer Dashboard** — Policy overview, claim status, payment history
- **Admin Panel** — User management, plan CRUD, claim approvals
- **Analytics & Charts** — Visual insights via Recharts
- **Dark Mode** — Full dark/light theme support

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    KISANCLAIM PLATFORM                       │
├──────────────────────┬──────────────────────────────────────┤
│                      │                                      │
│   🖥️ FRONTEND        │   ⚙️  BACKEND (API Routes)            │
│                      │                                      │
│   Next.js 16         │   /api/auth/*      → JWT Auth        │
│   React 19           │   /api/plans       → Plan CRUD       │
│   Tailwind CSS 4     │   /api/policies    → Policy Mgmt     │
│   Radix UI (55+)     │   /api/claims      → Claim Filing    │
│   Recharts           │   /api/fraud-check → AI Scoring      │
│   SWR                │   /api/chat        → KisanMitra Bot  │
│                      │   /api/recommend   → ML Suggestions  │
│                      │   /api/quote       → Premium Calc    │
├──────────────────────┴──────────────────────────────────────┤
│                                                             │
│   🧠 ML BACKEND (Python)                                    │
│   ├── fraud_scorer.py     → Claim fraud risk scoring        │
│   ├── pattern_detector.py → Historical anomaly detection    │
│   ├── photo_verifier.py   → Crop damage image validation    │
│   └── train_models.py     → Model training pipeline         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│          💾 In-Memory Data Store (Zero Config)               │
│          🔐 JWT Auth via HttpOnly Cookies (jose)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
KisanClaim/
├── 📁 app/
│   ├── (main)/              # 🏠 Public — Home, Plans, Quote, Advisor, Compare
│   ├── (auth)/              # 🔐 Auth — Login & Signup
│   ├── (dashboard)/         # 📊 User Dashboard — Policies, Claims, Payments
│   ├── (admin)/             # 👑 Admin Panel — Users, Plans, Claims Management
│   └── api/                 # ⚡ 11 REST API endpoints
├── 📁 backend/
│   ├── ml/                  # 🧠 ML models (fraud, photos, patterns)
│   ├── models/              # 📦 Database schemas
│   └── requirements.txt     # 🐍 Python dependencies
├── 📁 components/
│   ├── ui/                  # 🎨 55+ Radix-based UI components
│   ├── home/                # 🏠 Landing page sections
│   ├── layout/              # 📐 Navbar & Footer
│   └── chatbot.tsx          # 💬 KisanMitra AI assistant
├── 📁 hooks/                # 🪝 useAuth, useToast, useMobile
├── 📁 lib/                  # 🔧 Auth, data store, utilities
├── 📁 models/               # 📋 TypeScript data models
├── 📁 types/                # 📝 Type definitions
└── 📁 public/               # 🖼️ Static assets
```

---

## ⚡ Quick Start

### Prerequisites
| Tool | Version |
|------|---------|
| Node.js | ≥ 18.17 (recommended: 20.x LTS) |
| npm | ≥ 9.x |

### Installation

```bash
# Clone the repository
git clone https://github.com/ShradhaV08/KisanClaim.git
cd KisanClaim

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open **http://localhost:3000** and you're ready to go! 🎉

> 💡 **No database, Docker, or API keys required.** The app runs entirely offline with an in-memory data store.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 👤 **Farmer** | `demo@kisanclaim.com` | `demo123` |
| 👑 **Admin** | `admin@kisanclaim.com` | `admin123` |
| 🤝 **Agent** | `agent@kisanclaim.com` | `agent123` |

---

## 🧠 ML Pipeline

The Python-based ML backend provides three core intelligence modules:

| Module | File | Purpose |
|--------|------|---------|
| 🔍 **Fraud Scorer** | `backend/ml/fraud_scorer.py` | Multi-factor risk scoring for claim submissions |
| 📸 **Photo Verifier** | `backend/ml/photo_verifier.py` | AI validation of crop damage photographs |
| 📈 **Pattern Detector** | `backend/ml/pattern_detector.py` | Historical anomaly & suspicious pattern detection |

```bash
# Setup ML backend
cd backend
pip install -r requirements.txt
python ml/train_models.py
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center"><strong>Frontend</strong></td>
<td align="center"><strong>Backend</strong></td>
<td align="center"><strong>AI / ML</strong></td>
<td align="center"><strong>DevOps</strong></td>
</tr>
<tr>
<td>
  Next.js 16<br/>
  React 19<br/>
  TypeScript 5.7<br/>
  Tailwind CSS 4<br/>
  Radix UI<br/>
  Recharts<br/>
  SWR
</td>
<td>
  Next.js API Routes<br/>
  JWT (jose)<br/>
  bcrypt.js<br/>
  Zod validation<br/>
  MongoDB (models)<br/>
  In-memory store
</td>
<td>
  Vercel AI SDK<br/>
  Python ML pipeline<br/>
  Fraud scoring<br/>
  Photo verification<br/>
  Pattern detection
</td>
<td>
  Vercel (hosting)<br/>
  GitHub Actions<br/>
  Docker support<br/>
  Turbopack (dev)
</td>
</tr>
</table>

---

## 🌐 Deployment

The app is deployed on **Vercel** (free tier) with automatic deployments on every push to `main`.

| Environment | URL |
|-------------|-----|
| 🟢 **Production** | [kisan-claim.vercel.app](https://kisan-claim.vercel.app) |

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📋 Features Checklist

- [x] 🔐 User authentication (Login / Signup / Logout)
- [x] 🎫 JWT-based session management (HttpOnly cookies)
- [x] 📋 Insurance plans browsing & comparison
- [x] 💰 Premium quote calculator
- [x] 🤖 AI-powered plan recommendations
- [x] 🛒 Policy purchase flow
- [x] 📝 Claim filing & tracking
- [x] 🔍 AI fraud detection scoring
- [x] 💬 Offline chatbot assistant (KisanMitra)
- [x] 📊 User dashboard with overview stats
- [x] 👑 Admin panel for management
- [x] 💳 Payment / transaction history
- [x] 📱 Responsive design (mobile + desktop)
- [x] 🌙 Dark mode support
- [x] 🔌 100% offline — no external APIs or databases needed

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "Add amazing feature"

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with 💚 for Indian Farmers 🌾
</p>

<p align="center">
  <a href="https://kisan-claim.vercel.app">Live Demo</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-contributing">Contributing</a>
</p>
