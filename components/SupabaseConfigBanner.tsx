"use client";

import { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

interface Props {
  className?: string;
}

export default function SupabaseConfigBanner({ className = "" }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const envSnippet = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-amber-50 border-b border-amber-200 text-amber-900 text-sm py-2.5 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong className="font-semibold text-amber-950">Supabase Setup Mode:</strong> Connected in local preview. To enable real database and auth, add your Supabase credentials to <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-mono text-xs">.env.local</code>.
          </span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium text-amber-800 hover:text-amber-950 underline flex items-center gap-1 shrink-0 ml-6 md:ml-0"
        >
          {expanded ? "Hide instructions" : "Setup instructions"}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-amber-200/60 text-xs text-amber-900 space-y-2">
          <p>
            1. Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline font-medium hover:text-amber-950">supabase.com</a>.
          </p>
          <p>
            2. Run the migration script located at <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">supabase/migrations/20261121000000_qrdine_init.sql</code> in the Supabase SQL Editor.
          </p>
          <p>
            3. Paste your credentials into <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code>:
          </p>
          <div className="relative bg-slate-900 text-slate-100 p-3 rounded font-mono text-xs overflow-x-auto my-2">
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Copy snippet"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre>{envSnippet}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
