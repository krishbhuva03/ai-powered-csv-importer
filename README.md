# AI-Powered CSV Importer

Upload any CSV file - AI intelligently maps columns to GrowEasy CRM format.

---

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **AI**: Groq (Llama 3.3 70B) - free tier, no credit card required
- **Deployment**: Docker-ready

---

## Prerequisites

- Node.js 18 or higher
- A free Groq API key (get one at https://console.groq.com)

---

## Setup Instructions

### 1. Get a Groq API Key

1. Go to https://console.groq.com
2. Sign up with your email or Google account
3. Navigate to the API Keys section
4. Click "Create API Key"
5. Copy the key (starts with `gsk_`)

### 2. Install Dependencies

Open two terminal windows.

**Terminal 1 - Backend:**

```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm install
```

### 3. Configure Environment

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and replace `your_groq_api_key_here` with your actual Groq API key.

The file should look like:

```
GROQ_API_KEY=gsk_your_actual_key_here
PORT=3001
```

### 4. Start the Application

**Terminal 1 - Backend (starts on port 3001):**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (starts on port 3000):**

```bash
cd frontend
npm run dev
```

### 5. Open the App

Go to **http://localhost:3000** in your browser.

---

## How to Use

1. **Upload** - Drag and drop a CSV file or click to browse
2. **Preview** - Review the parsed rows in a scrollable table
3. **Confirm** - Click "Confirm Import" to send to AI
4. **Results** - View the AI-extracted CRM records with import summary

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/preview | Upload CSV and preview parsed rows |
| POST | /api/import | Upload CSV and get AI-extracted CRM records |
| GET | /api/health | Health check |

---

## CRM Fields Extracted

created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note, data_source, possession_time, description

### Allowed CRM Statuses

- GOOD_LEAD_FOLLOW_UP
- DID_NOT_CONNECT
- BAD_LEAD
- SALE_DONE

### Allowed Data Sources

- leads_on_demand
- meridian_tower
- eden_park
- varah_swamy
- sarjapur_plots

---

## Docker Setup

```bash
GROQ_API_KEY=gsk_your_key_here docker compose up --build
```

---

## Project Structure

```
AI-powered CSV Importer/
├── backend/
│   └── src/
│       ├── index.ts              # Express server (port 3001)
│       ├── routes/import.ts      # API routes
│       ├── services/csvParser.ts # CSV parsing
│       ├── services/aiExtractor.ts # AI extraction (Groq)
│       └── types/index.ts        # TypeScript types
├── frontend/
│   └── src/
│       ├── app/page.tsx          # Main page (3-step flow)
│       ├── components/
│       │   ├── UploadStep.tsx    # Drag & drop upload
│       │   ├── PreviewStep.tsx   # CSV preview table
│       │   └── ResultStep.tsx    # AI result table
│       └── lib/api.ts            # API client
├── Dockerfile
├── docker-compose.yml
└── README.md
```
