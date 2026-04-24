import { useRef, useState } from 'react'

interface UploadCardProps {
  label: string
  onMockProcessed: (fileName: string) => void
}

export function UploadCard({ label, onMockProcessed }: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState('')
  const [status, setStatus] = useState('')

  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4">
      <p className="font-medium text-slate-800">{label}</p>
      <p className="mt-1 text-xs text-slate-500">Accepted: PDF, DOCX, TXT</p>
      <button
        onClick={() => inputRef.current?.click()}
        className="mt-3 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Simulate upload
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (!file) return
          setFileName(file.name)
          setStatus('Processed successfully')
          onMockProcessed(file.name)
        }}
      />
      {fileName && <p className="mt-3 text-xs text-slate-600">Uploaded: {fileName}</p>}
      {status && <p className="mt-1 text-xs font-medium text-emerald-600">{status}</p>}
    </div>
  )
}
