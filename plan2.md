# Project Plan 2: Cardiovascular Risk Calculator (ACC/AHA 2023 PREVENT)
*Updated: April 29, 2026*

---

## 1. Project Initialization

- [x] **Vite + React + TypeScript** — bootstrapped with `npm create vite@latest`
- [x] **Tailwind CSS v4** — configured via `@import "tailwindcss"` in `index.css`
- [x] **File structure**
  ```
  src/
    components/
      RiskCalculator.tsx   — root form component
      InputRow.tsx         — reusable numeric input + unit select row
      RadioRow.tsx         — reusable toggle (Yes/No, Female/Male)
      ResultsDisplay.tsx   — results panel
    utils/
      calculations.ts      — PREVENT equation engine
    App.tsx
    main.tsx
    index.css
  ```
- [x] **TypeScript strict config** — `tsconfig.json` with `strict: true`

---

## 2. Core Calculation Engine (`src/utils/calculations.ts`)

- [x] **Coefficient matrix** — `coeff[32][60]` ported exactly from the official AHA calculator source
  - 60 columns = 30 Female/Male pairs × 5 model variants × 6 outputs
  - 32 rows = predictors + interaction terms + intercept (`coeff[31]`)
- [x] **BMI** — `weight(kg) / (height(m))²`
- [x] **eGFR** — CKD-EPI 2021 (race-free)
  ```
  eGFR = 142 × min(Scr/κ,1)^α × max(Scr/κ,1)^-1.2 × 0.9938^Age × SexFactor
  Female: κ=0.7, α=-0.241, SexFactor=1.012
  Male:   κ=0.9, α=-0.302, SexFactor=1.0
  ```
- [x] **PREVENT logit** (`calcRiskLogit`) — 23-term linear predictor:
  - Age, Age², Non-HDL, HDL, SBP (low/high spline), Diabetes, Smoking
  - BMI (low/high spline), eGFR (low/high spline)
  - HTN medication, Statin, interaction terms (Age×Chol, Age×HDL, Age×SBP, Age×DM, Age×Smoking, Age×eGFR)
  - Add-on factors: HbA1c, UACR, SDI (zip code fallback)
  - Intercept
- [x] **Logistic transformation** — `risk% = 100 × exp(logit) / (1 + exp(logit))`
- [x] **Model selection** (auto, based on inputs provided)

  | Optional inputs entered | Model used | Column offset |
  |---|---|---|
  | None | Base model | 48 + Sex |
  | HbA1c only | Add-on (HbA1c) | 12 + Sex |
  | UACR only | Add-on (UACR) | 24 + Sex |
  | HbA1c + UACR | Full add-on | 0 + Sex |

- [x] **Unit conversions** — height (in→cm), weight (lb→kg), cholesterol (mmol/L→mg/dL), creatinine (μmol/L→mg/dL)
- [x] **Input validation + range checks**

  | Variable | Valid range |
  |---|---|
  | Age | 30–79 yr |
  | Total cholesterol | 130–320 mg/dL |
  | HDL cholesterol | 20–100 mg/dL |
  | Systolic BP | 90–200 mmHg |
  | Serum creatinine | 0.3–30 mg/dL |
  | HbA1c (optional) | 3–15 % |
  | UACR (optional) | 0–25,000 mg/g |
  | BMI (computed) | 18.5–39.9 kg/m² |
  | eGFR (computed) | 15–140 mL/min |

- [x] **30-year risk** — not calculated for age ≥ 60

---

## 3. UI Components

### 3.1 `InputRow.tsx`
- [x] Numeric input field + unit select dropdown
- [x] **Bug fix** — unit select now has `name={name + 'Unit'}` and uses the shared `onChange` handler, so unit changes correctly update state

### 3.2 `RadioRow.tsx`
- [x] Pill-style toggle (Female/Male, No/Yes)
- [x] Accessible `<input type="radio">` hidden under label click area

### 3.3 `RiskCalculator.tsx`
- [x] `useState` for all form inputs (strings + unit names)
- [x] `useMemo(() => calculatePrevent(inputs), [inputs])` — live recalculation on every input change
- [x] Sticky navbar with CardioRisk logo
- [x] 4 input cards: Patient Profile, Clinical Data, Medical History, Optional Novel Risk Factors
- [x] 2-column layout on xl screens (form left, results right sticky)

### 3.4 `ResultsDisplay.tsx`
- [x] **Primary ASCVD card** — large %, color-coded by risk level
  - < 5%: Low (green) | 5–7.5%: Borderline (yellow) | 7.5–20%: Intermediate (orange) | ≥ 20%: High (red)
- [x] **10-year risk breakdown** — 3 animated progress bars (ASCVD, HF, Total CVD)
- [x] **Clinical metrics** — BMI with category label, eGFR with CKD stage (G1–G5)
- [x] **30-year risk** — 3 value cards or "not available ≥60" warning
- [x] **Model type badge** — "Base model" / "Add-on model"
- [x] **Error display** — shows validation errors inline
- [x] **Decimal precision selector** — 1 or 2 decimal places, controls all displayed values

---

## 4. Design System

- [x] **Color palette** — Slate (backgrounds), Blue (primary), Indigo (optional factors), Rose (clinical), Amber (history), Emerald/Orange/Red (risk levels)
- [x] **Typography** — `font-black` for numbers, `font-semibold` for labels, `uppercase tracking-widest` for section headers
- [x] **Cards** — `rounded-2xl`, `border border-slate-200`, `shadow-sm`
- [x] **SVG icons** — all use explicit `width`/`height` attributes (not Tailwind classes) to prevent oversized rendering in print/PDF
- [x] **Sticky navbar** — `backdrop-blur-md` glassmorphism effect
- [x] **Responsive** — single column on mobile, 2-column grid on xl+

---

## 5. Verification

- [x] **TypeScript** — `npx tsc --noEmit` passes with zero errors
- [x] **Reference case validated** against UpToDate AHA 2023 calculator:

  | Input | Value |
  |---|---|
  | Age | 70 yr, Female |
  | Height / Weight | 160 cm / 70 kg |
  | Total / HDL Cholesterol | 220 / 40 mg/dL |
  | Systolic BP | 170 mmHg |
  | Serum creatinine | 0.9 mg/dL |
  | HTN med / Statin | No / Yes |
  | Diabetes / Smoking | Yes / Yes |
  | HbA1c / UACR | 7% / 1.2 mg/g |

  | Output | Expected | Calculated |
  |---|---|---|
  | BMI | 27.3 kg/m² | ✅ 27.3 |
  | eGFR | 68.8 mL/min | ✅ 68.8 |
  | 10-yr ASCVD | 14% | ✅ 14.0% |
  | 10-yr Heart Failure | 11.1% | ✅ 11.1% |
  | 10-yr Total CVD | 20.1% | ✅ 20.1% |

---

## 6. How to Run

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Type check
npx tsc --noEmit

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## 7. Deployment

- [ ] **Build** — `npm run build` → outputs to `dist/`
- [ ] **Choose platform**:
  - **Vercel** (recommended) — connect GitHub repo → auto deploy on push
  - **Netlify** — drag & drop `dist/` folder or connect repo
  - **GitHub Pages** — add `gh-pages` package, set `base` in `vite.config.ts`
- [ ] **Vite base path** — if deploying to a sub-path (e.g. GitHub Pages), set `base: '/repo-name/'` in `vite.config.ts`
- [ ] **Environment check** — verify all assets load correctly on production URL

---

## 8. Known Limitations / Future Work

- **ZIP code / SDI lookup** — Social Deprivation Index lookup requires a zip-code database (~50k entries). Currently uses the fallback coefficient (`coeff[25]`), which is equivalent to "no zip code entered". To enable: load the SDI lookup table and map zip → SDI group (1–3).
- **Unit display** — mmol/L input for cholesterol is accepted and converted internally; displayed results are always in mg/dL equivalent (no back-conversion to mmol/L).
- **Print layout** — current CSS is screen-optimized; a `@media print` stylesheet would improve printed output.
