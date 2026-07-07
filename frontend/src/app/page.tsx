'use client';

import { useState } from 'react';
import UploadStep from '../components/UploadStep';
import PreviewStep from '../components/PreviewStep';
import ResultStep from '../components/ResultStep';
import { uploadPreview, importCsv, type PreviewData, type ImportResult } from '../lib/api';

type Step = 'upload' | 'preview' | 'result';

export default function Home() {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setPreviewLoading(true);

    try {
      const data = await uploadPreview(selectedFile);
      setPreview(data);
      setStep('preview');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!file) return;
    setImportLoading(true);
    setError(null);

    try {
      const data = await importCsv(file);
      setResult(data);
      setStep('result');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setImportLoading(false);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          AI-Powered CSV Importer
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Upload any CSV — AI intelligently maps it to CRM format
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {(['upload', 'preview', 'result'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors sm:h-8 sm:w-8 ${
                    step === s
                      ? 'bg-blue-600 text-white'
                      : ['preview', 'result'].indexOf(s) <= ['upload', 'preview', 'result'].indexOf(step)
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-400 dark:bg-neutral-800 dark:text-gray-500'
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`hidden text-xs font-medium sm:inline ${
                    step === s
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {s === 'upload' ? 'Upload' : s === 'preview' ? 'Preview' : 'Results'}
                </span>
              </div>
              {i < 2 && (
                <div className="h-px w-8 bg-gray-200 dark:bg-gray-700 sm:w-12" />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="mx-auto max-w-4xl">
        {step === 'upload' && (
          <UploadStep onFileSelected={handleFileSelected} loading={previewLoading} />
        )}

        {step === 'preview' && preview && (
          <PreviewStep
            columns={preview.columns}
            rows={preview.rows}
            totalRows={preview.totalRows}
            onConfirm={handleConfirmImport}
            loading={importLoading}
          />
        )}

        {step === 'result' && result && (
          <ResultStep result={result} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
