# SevaSetu: NGO Research Study & Data Collection Workspace

SevaSetu is an interactive, professional data curation and visual dashboard designed for researching, analyzing, and organizing verified social sector NGOs active in India. This full-stack application enables users to manage developmental indexes across critical social sectors (including Education, Healthcare, Animal Welfare, Women Empowerment, and Environmental Conservation) with fully local state persistence, graphical metrics, and instant spreadsheet compatibility.

## 🌟 Key Features

### 1. Interactive NGO Directory
* **Curated Presets**: Preloaded with high-fidelity, peer-reviewed Indian developmental NGOs (e.g., Goonj, SEWA, Akshaya Patra, Childline India).
* **Multi-Filter Systems**: Dynamic tag filtering by developmental focus areas, regions, and search patterns.
* **Custom scout entries**: Form inputs to dynamically register hand-researched organization records with immediate persistence.
* **Dossier Inspectors**: Floating modal sheets displaying deep operational history, headquarters, website channels, established years, and private rich-text researcher notes.

### 2. Analytical & Statistical Metrics
* **Dynamic Indicator Gauges**: Responsive metric containers demonstrating overall completion rates and sector-specific representations.
* **Bento Analytics Layout**: High-contrast graphic summaries showing a distribution ratio of focus areas instantly calculated from the active dataset.

### 3. AI-Assisted Scouting Panel
* **Developmental Scouting Engine**: Enter an developmental goal, region, or keyword to retrieve formatted NGO profiles.
* **Smart Duplication Prevention**: Checks new queries against custom collected entries to preserve data integrity and prevent double entries.
* **Instant Import**: One-click ingestion into the active workspace database.

### 4. Excel / Spreadsheet Exporter & Portfolio Controller
* **Robust CSV Compilation**: Generates standard RFC 4180-compliant comma-separated CSV spreadsheets directly within the browser client.
* **Preassembled Reports**: Export a structured TXT text log of the research study registry.
* **Media & Progress Registry**: Manage and log file delivery URL states, local completion checklists, and social metrics.

---

## 🛠 Tech Stack

* **Frontend Framework**: React 19 (Vite Single Page Application architecture)
* **Backend Server**: Express (handles secure proxy routing and production-grade static serving)
* **Design Systems**: Tailwind CSS (Utility-first theme styling)
* **Motion Library**: `motion` for fluid rendering and high-performance layout transitions
* **Iconography**: Lucide React (featherweight SVG icons)
* **Runtime**: Node.js & TypeScript
* **Development Tools**: `tsx` (TypeScript executor) & `esbuild` (bundling compiler)

---

## 🚀 Setting Up Locally

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file at the root of your project directory based on the `.env.example` template:
```env
# Server configuration
PORT=3000
```

### 3. Launch Development Server
Runs the Express backend server using TypeScript compilation under hot reloading:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Build for Production
To bundle both the compiled frontend assets and the CJS backend script safely into the executable output directory:
```bash
npm run build
```

### 5. Start Production Server
Executes the production bundle using optimized Node.js process:
```bash
npm run start
```

---

## 📂 Project Structure

```
├── server.ts                 # Full-stack backend Express entry point
├── package.json              # Script declarations & project dependencies
├── vite.config.ts            # Frontend module build pipelines
├── tsconfig.json             # TypeScript rule configurations
├── src/
│   ├── App.tsx               # Main application controller & tab navigation
│   ├── main.tsx              # React mounting entry point
│   ├── index.css             # Global Tailwind stylesheets and theme configuration
│   ├── types.ts              # Schema declarations and data interfaces
│   ├── ngosData.ts           # Curated preloaded NGO developmental datasets
│   └── components/
│       ├── AiAssistant.tsx       # AI-assisted research panel
│       ├── MetricsVisualizer.tsx # Multi-indicator metrics and database stats
│       ├── NgosGrid.tsx          # Data tables, filters, and scout forms
│       ├── NgoDetailModal.tsx    # Comprehensive dossiers with rich text notepad
│       └── HomeworkTracker.tsx   # Spreadsheet compiling, logs, and link portals
```

---

## ⚙️ License & Contributions
This app is designed as an analytical study framework. All records compiled within the active workspace are stored securely within local sandboxed browser storage. Feel free to tweak layout properties, expand NGO dataset values, or integrate customized data endpoints.
