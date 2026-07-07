'use client';

import type { ImportResult } from '../lib/api';

interface ResultStepProps {
  result: ImportResult;
  onReset: () => void;
}

const CRM_COLUMNS = [
  'created_at', 'name', 'email', 'country_code', 'mobile_without_country_code',
  'company', 'city', 'state', 'country', 'lead_owner', 'crm_status',
  'crm_note', 'data_source', 'possession_time', 'description',
];

export default function ResultStep({ result, onReset }: ResultStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-green-600 dark:text-green-400">Imported</p>
          <p className="mt-1 text-2xl font-bold text-green-700 dark:text-green-300">{result.totalImported}</p>
        </div>
        {result.totalSkipped > 0 && (
          <div className="rounded-xl border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-yellow-600 dark:text-yellow-400">Skipped</p>
            <p className="mt-1 text-2xl font-bold text-yellow-700 dark:text-yellow-300">{result.totalSkipped}</p>
          </div>
        )}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-neutral-800 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Parsed</p>
          <p className="mt-1 text-2xl font-bold text-gray-700 dark:text-gray-300">{result.totalParsed}</p>
        </div>
      </div>

      {result.skipped.length > 0 && (
        <div className="rounded-xl border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/30 p-4">
          <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Skipped Records</h3>
          <ul className="mt-2 space-y-1">
            {result.skipped.map((s, i) => (
              <li key={i} className="text-sm text-yellow-700 dark:text-yellow-300">
                Row {s.row}: {s.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.success.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="overflow-auto scrollbar-thin max-h-[600px]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="sticky top-0 z-10 bg-gray-50 dark:bg-neutral-800">
                  <th className="whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    #
                  </th>
                  {CRM_COLUMNS.map((col) => (
                    <th
                      key={col}
                      className="whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      {col.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.success.map((record, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 dark:border-gray-800/50 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                  >
                    <td className="whitespace-nowrap px-3 py-2 text-xs text-gray-400">
                      {idx + 1}
                    </td>
                    {CRM_COLUMNS.map((col) => (
                      <td
                        key={col}
                        className="whitespace-nowrap px-3 py-2 text-gray-700 dark:text-gray-300"
                      >
                        {(record as unknown as Record<string, string>)[col] || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="rounded-lg border border-gray-300 dark:border-gray-600 px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
        >
          Import Another File
        </button>
      </div>
    </div>
  );
}
