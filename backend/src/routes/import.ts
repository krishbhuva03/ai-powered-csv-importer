import { Router, Request, Response } from 'express';
import multer from 'multer';
import { parseCsvBuffer } from '../services/csvParser';
import { AiExtractor } from '../services/aiExtractor';
import { ImportResponse } from '../types';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

export function createImportRouter(aiExtractor: AiExtractor): Router {
  const router = Router();

  router.post('/preview', upload.single('file'), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const { columns, rows } = parseCsvBuffer(req.file.buffer);

      res.json({
        columns,
        rows: rows.slice(0, 50),
        totalRows: rows.length,
      });
    } catch (error) {
      res.status(400).json({ error: 'Failed to parse CSV: ' + (error as Error).message });
    }
  });

  router.post('/import', upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const { rows } = parseCsvBuffer(req.file.buffer);

      if (rows.length === 0) {
        res.status(400).json({ error: 'CSV file is empty' });
        return;
      }

      const result = await aiExtractor.extract(rows);

      const response: ImportResponse = {
        success: true,
        data: result,
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Import failed: ' + (error as Error).message,
      });
    }
  });

  return router;
}
