# CardioRisk PREVENT — Project Documentation (plan3.md)

ACC/AHA 2023 PREVENT Cardiovascular Risk Calculator — เอกสารฉบับสมบูรณ์ตั้งแต่เริ่มต้นจนถึง deployment

---

## 📋 สารบัญ

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Initialization](#3-project-initialization)
4. [Project Structure](#4-project-structure)
5. [Calculation Engine](#5-calculation-engine)
6. [UI Architecture](#6-ui-architecture)
7. [Design System](#7-design-system)
8. [Bug Fixes & Lessons Learned](#8-bug-fixes--lessons-learned)
9. [Verification](#9-verification)
10. [How to Run](#10-how-to-run)
11. [Deployment](#11-deployment)
12. [Known Limitations](#12-known-limitations)

---

## 1. Project Overview

**ชื่อโปรเจกต์**: CardioRisk PREVENT
**วัตถุประสงค์**: เครื่องมือคำนวณความเสี่ยงโรคหัวใจและหลอดเลือดตาม **ACC/AHA 2023 PREVENT Equations** (Khan et al. Circulation 2024)

**คำนวณค่าได้**:
- 10-year ASCVD risk
- 10-year Heart Failure risk
- 10-year Total CVD risk
- 30-year risks (เฉพาะอายุ < 60)
- BMI + classification
- eGFR (CKD-EPI 2021 race-free) + classification

**Models**:
- Base model — input หลัก
- Add-on model — เพิ่ม HbA1c, UACR, Zip code (SDI)

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 19 |
| Language | TypeScript | strict mode |
| Build Tool | Vite | 8 |
| Styling | Tailwind CSS | v4 + inline styles |
| Font | Inter (Google Fonts) | — |

**Why this stack:**
- React 19 + TypeScript → type-safe, modern hooks
- Vite → fast dev server (HMR < 100ms)
- Tailwind v4 → utility-first styling
- Inline styles → bypass Tailwind v4 quirks for critical components

---

## 3. Project Initialization

```bash
# 1. Create Vite + React + TypeScript project
npm create vite@latest cardio-vascular-calculator -- --template react-ts

cd cardio-vascular-calculator

# 2. Install dependencies
npm install

# 3. Add Tailwind CSS v4
npm install -D tailwindcss @tailwindcss/vite

# 4. Configure Vite plugin
# vite.config.ts:
#   import tailwindcss from '@tailwindcss/vite'
#   plugins: [react(), tailwindcss()]

# 5. Add Tailwind import to src/index.css
#   @import "tailwindcss";

# 6. Run dev server
npm run dev
```

---

## 4. Project Structure

```
Cardio Vascular Calculator/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── RiskCalculator.tsx    ← Main form + layout
│   │   └── ResultsDisplay.tsx    ← Risk output panels
│   ├── utils/
│   │   └── calculations.ts       ← PREVENT engine
│   ├── App.tsx                   ← Root (mounts RiskCalculator)
│   ├── main.tsx                  ← React DOM bootstrap
│   └── index.css                 ← Tailwind + global CSS
├── index.html                    ← HTML shell + Inter font
├── package.json
├── tsconfig.json
├── vite.config.ts
├── plan.md                       ← Initial planning
├── plan2.md                      ← Mid-project doc
└── plan3.md                      ← This file (final doc)
```

---

## 5. Calculation Engine

**File**: `src/utils/calculations.ts`

### 5.1 Core Algorithm

ใช้ **logistic transformation** จาก official AHA calculator JS:

```
risk(%) = 100 × exp(logit) / (1 + exp(logit))
```

โดย `logit` คำนวณจาก 23-term linear combination ของ:
- Demographics (age, sex)
- Lipids (TChol, HDL, non-HDL)
- Blood pressure (SBP)
- Diabetes status
- Smoking status
- Treatment (statin, BP med)
- Renal function (eGFR)
- BMI
- Optional: HbA1c, UACR, SDI

### 5.2 Coefficient Matrix

**32×60 matrix** (5 model variants × 6 outputs × 2 sexes)

| Model Type | Female cols | Male cols |
|---|---|---|
| Full add-on (HbA1c+UACR+SDI) | 0 | 1 |
| HbA1c only | 12 | 13 |
| UACR only | 24 | 25 |
| Base | 48 | 49 |

### 5.3 Helper Functions

```typescript
calcBMI(weightKg, heightCm)
  → weight / (height/100)²

calcEGFR(creatMgdl, age, sex)  // CKD-EPI 2021 race-free
  → 142 × min(scr/κ, 1)^α × max(scr/κ, 1)^(-1.200)
       × 0.9938^age × (1.012 if female)
```

### 5.4 Unit Conversions

| From | To | Factor |
|---|---|---|
| in | cm | × 2.54 |
| lb | kg | × 0.453592 |
| mmol/L (chol) | mg/dL | × 38.67 |
| μmol/L (creat) | mg/dL | × 0.011312 |

### 5.5 Validation Ranges

| Field | Min | Max |
|---|---|---|
| Age | 30 | 79 |
| Total Cholesterol | 130 | 320 mg/dL |
| HDL | 20 | 100 mg/dL |
| Systolic BP | 90 | 200 mmHg |
| Creatinine | 0.3 | 30 mg/dL |
| HbA1c | 3 | 15 % |
| UACR | 0 | 25000 mg/g |
| BMI | 18.5 | 39.9 |
| eGFR | 15 | 140 mL/min/1.73m² |

### 5.6 Output Interface

```typescript
export interface PreventResults {
  bmi: number | null;
  egfr: number | null;
  ascvd10: number | null;
  hf10: number | null;
  cvd10: number | null;
  ascvd30: number | null;  // null if age ≥ 60
  hf30: number | null;
  cvd30: number | null;
  modelType: 'base' | 'addon';
  errors: string[];
}
```

---

## 6. UI Architecture

### 6.1 Component Tree

```
App
└── RiskCalculator              ← Form state + 2-column layout
    ├── Toggle (×4)              ← Inline-style toggle switch
    ├── Field (×11)              ← Input + unit selector tile
    ├── Card                     ← Section panel wrapper
    └── ResultsDisplay
        ├── Hero (10-yr ASCVD)   ← Big number display
        ├── 10-Year Breakdown    ← Bar chart (3 metrics)
        ├── BMI + eGFR chips
        └── 30-Year Risk grid    ← (if age < 60)
```

### 6.2 State Management

```typescript
const [inputs, setInputs] = useState({
  age, sex, height, weight,
  totalChol, hdlChol, systolicBP, creatinine,
  onHypertensionMed, onStatin, hasDiabetes, isSmoking,
  hbA1c, uacr, zipCode,
  // + unit fields for each
});

const results = useMemo(() => calculatePrevent(inputs), [inputs]);
// → Real-time recalculation on every input change
```

### 6.3 Layout

```
┌─────────────────────────────────────────────┐
│  CardioRisk PREVENT  [ACC/AHA 2023]         │ ← Sticky header
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐  ┌──────────────────┐    │
│  │ Clinical     │  │ Risk Assessment  │    │ ← 2 columns
│  │ Parameters   │  │                  │    │   on ≥768px
│  │              │  │ [10-yr ASCVD %]  │    │
│  │ • Profile    │  │ [Breakdown bars] │    │
│  │ • Measure    │  │ [BMI │ eGFR]     │    │
│  │ • History    │  │ [30-yr grid]     │    │
│  │ • Optional   │  │                  │    │
│  └──────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────┘

< 768px → stack เป็น single column
```

---

## 7. Design System

### 7.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#0d0f18` | App background |
| `--bg-card` | `#161925` | Card surface |
| `--border` | `rgba(255,255,255,0.07)` | Card borders |
| `--text-primary` | `#e2e8f0` | Body text |
| `--text-muted` | `#6b7280` | Labels |
| `--accent` | `#4f46e5` / `#818cf8` | Indigo primary |

### 7.2 Risk Level Colors

| Level | Range | Color |
|---|---|---|
| Low Risk | < 5% | Emerald `#16a34a` |
| Borderline | 5–7.5% | Amber `#d97706` |
| Intermediate | 7.5–20% | Orange `#ea580c` |
| High Risk | ≥ 20% | Red `#dc2626` |

### 7.3 Typography

- Font: **Inter** (300/400/500/600/700/900)
- Heading: 18–20px / 700
- Body: 14px / 400
- Label: 11px / 700 / uppercase / letter-spacing 0.09em
- Hero number: 88px / 900

### 7.4 Responsive Grid (CSS-based, bypass Tailwind v4)

```css
.layout-2col {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .layout-2col { grid-template-columns: 1fr 1fr; }
}

.grid-2 { grid-template-columns: 1fr 1fr; }
.grid-3 { grid-template-columns: 1fr 1fr 1fr; }
```

---

## 8. Bug Fixes & Lessons Learned

### 8.1 Unit Selector Not Updating
**Problem**: Unit dropdown changes ไม่ trigger recalculation
**Cause**: Missing `name` attribute + ใช้ separate `onUnitChange` handler
**Fix**: เพิ่ม `name="${name}Unit"` แล้วใช้ shared `onChange`

### 8.2 SVG Icons Enormous in Print/PDF
**Problem**: Icons ขนาดใหญ่มากเมื่อ export เป็น PDF
**Cause**: Tailwind `w-N h-N` ไม่ constrain SVG intrinsic size ใน print mode
**Fix**: ใช้ explicit `width="16" height="16"` HTML attributes

### 8.3 Material Symbols Icons ไม่แสดง
**Problem**: Icons เป็น squares หรือ tiny emoji
**Cause**: Google Fonts loading + CSS specificity conflicts
**Fix**: ลบ Material Symbols ออกทั้งหมด — ใช้ text labels แทน (reliable มากกว่า)

### 8.4 Toggle Switches ไม่ render
**Problem**: Knob ไม่แสดงใน toggle switch
**Cause**: `translate-x-5` ใน Tailwind v4 ทำงานไม่เสถียรใน flex context
**Fix**: ใช้ inline styles ทั้งหมดสำหรับ toggle:
```tsx
style={{ left: checked ? 23 : 3, transition: 'left 0.2s ease' }}
```

### 8.5 Tailwind v4 Grid Classes ไม่ทำงาน
**Problem**: `grid-cols-2`, `grid-cols-3`, `md:grid-cols-2` ไม่ render เป็น grid
**Cause**: Tailwind v4 content detection อาจไม่ scan `.tsx` files ครบ
**Fix**: เขียน CSS classes เองใน `index.css` (`layout-2col`, `grid-2`, `grid-3`)

### 8.6 Glassmorphism + Fixed Sidebar ใน PDF
**Problem**: Layout breaks เมื่อ screenshot/PDF เพราะ `backdrop-filter` + `position: fixed`
**Cause**: Print mode strip CSS effects เหล่านี้ออก
**Fix**: เปลี่ยนเป็น simple design — solid cards, sticky (ไม่ใช่ fixed) header

### 8.7 Key Takeaway
> **เมื่อ Tailwind v4 ทำงานไม่ตามคาด ให้ fallback ไปใช้ inline styles หรือ pure CSS**
> สำหรับ critical components (toggle, layout grid) — reliability > convenience

---

## 9. Verification

### 9.1 Reference Test Case

| Input | Value |
|---|---|
| Age | 70 |
| Sex | Female |
| Total Chol | 220 mg/dL |
| HDL | 40 mg/dL |
| Systolic BP | 170 mmHg |
| Creatinine | 0.9 mg/dL |
| BP Med | No |
| Statin | Yes |
| Diabetes | Yes |
| Smoking | Yes |
| HbA1c | 7% |
| UACR | 1.2 mg/g |

**Expected output**: ASCVD 10-yr ≈ **14.0%** (Intermediate, orange)
**Actual output**: **13.99% → 14.0%** ✓ (matches UpToDate reference)

### 9.2 TypeScript Check

```bash
npx tsc --noEmit
# → 0 errors
```

---

## 10. How to Run

### 10.1 Development

```bash
# Install dependencies (first time only)
npm install

# Start dev server
npm run dev

# → http://localhost:5173
```

### 10.2 Build

```bash
# Type check + build
npm run build

# Output: dist/
```

### 10.3 Preview Production Build

```bash
npm run preview
```

---

## 11. Deployment

### 11.1 Option A — Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

**Auto-config**: Vercel detects Vite automatically — no config needed.

### 11.2 Option B — Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build + deploy
npm run build
netlify deploy --prod --dir=dist
```

หรือ push to GitHub แล้วเชื่อม Netlify dashboard:
- Build command: `npm run build`
- Publish directory: `dist`

### 11.3 Option C — GitHub Pages

```bash
# Install gh-pages
npm i -D gh-pages

# package.json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}

# vite.config.ts → set base path
base: '/cardio-vascular-calculator/'

# Deploy
npm run deploy
```

### 11.4 Pre-deploy Checklist

- [ ] `npm run build` ผ่านโดยไม่มี TypeScript error
- [ ] ทดสอบ production build ด้วย `npm run preview`
- [ ] ตรวจสอบ test case (Age 70 Female → 14%)
- [ ] ทดสอบ responsive ที่ขนาด ≥768px และ <768px
- [ ] ทดสอบทุก toggle + unit selector
- [ ] ทดสอบ validation ranges (input out of bounds → error)

---

## 12. Known Limitations

### 12.1 ZIP Code → SDI Lookup
**สถานะ**: ใช้ fallback coefficient `coeff[25]` (median SDI group)
**TODO**: integrate กับ SDI lookup database (ต้องมี ZIP→SDI mapping)

### 12.2 Print/PDF Output
**สถานะ**: UI แสดงผลใน browser ได้สวยงาม แต่ PDF export ยังต้องการ
- ตัด CSS effects ที่ไม่รองรับ (`backdrop-filter`, `position: fixed`)
- หรือใช้ library เช่น `react-pdf` / `puppeteer` สำหรับ PDF generation

### 12.3 Accessibility
**สถานะ**: ยังไม่มี
- ARIA labels บน toggle/select
- Keyboard navigation testing
- Color contrast audit (WCAG AA)

### 12.4 Internationalization
**สถานะ**: English only
**TODO**: i18n สำหรับ Thai labels (เช่น react-i18next)

### 12.5 Data Persistence
**สถานะ**: ไม่ persist
- ทุกครั้งที่ refresh จะ reset เป็น default values
- ไม่มี save/load patient profile

---

## 📝 Document History

| Version | Description |
|---|---|
| plan.md | Initial planning + frontend prototype |
| plan2.md | Mid-project — calculation engine + dark theme UI |
| **plan3.md** | **Final — simplified UI, bug fixes, deployment ready** |

---

**ACC/AHA 2023 PREVENT Equations · For clinical decision support only**
