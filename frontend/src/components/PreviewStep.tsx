'use client';

interface PreviewStepProps {
  columns: string[];
  rows: Record<string, string>[];
  totalRows: number;
  onConfirm: () => void;
  loading: boolean;
}

export default function PreviewStep({ columns, rows, totalRows, onConfirm, loading }: PreviewStepProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {rows.length} of {totalRows} rows
        </p>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing...
            </span>
          ) : (
            'Confirm Import'
          )}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="overflow-auto scrollbar-thin max-h-[600px]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="sticky top-0 z-10 bg-gray-50 dark:bg-neutral-800">
                <th className="whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-gray-100 dark:border-gray-800/50 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                >
                  <td className="whitespace-nowrap px-4 py-2.5 text-xs text-gray-400">
                    {rowIdx + 1}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="whitespace-nowrap px-4 py-2.5 text-gray-700 dark:text-gray-300"
                    >
                      {row[col] || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
