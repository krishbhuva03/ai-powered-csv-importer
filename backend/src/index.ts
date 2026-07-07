import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createImportRouter } from './routes/import';
import { AiExtractor } from './services/aiExtractor';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',');
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  console.error('GROQ_API_KEY is required');
  process.exit(1);
}

const aiExtractor = new AiExtractor(apiKey);
const importRouter = createImportRouter(aiExtractor);

app.use('/api', importRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app;
