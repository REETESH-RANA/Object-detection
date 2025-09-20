// In file: components/image-analyzer.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CloudUpload, FileImage } from 'lucide-react';

// 1. The data structure is simplified. We only care about the label now.
// The component will receive the 'box' and 'score' but will ignore them.
interface DetectionResult {
  label: string;
}

export function ImageAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // 2. The result state is now a simpler array.
  const [results, setResults] = useState<DetectionResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NOTE: The image preview state ('imagePreviewUrl') and its useEffect have been removed.

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setResults(null);
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to analyze image. The server might be down.');
      }
      const data: DetectionResult[] = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // This function to count objects remains the same.
  const getObjectCounts = () => {
    if (!results) return {};
    return results.reduce((acc, { label }) => {
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const objectCounts = getObjectCounts();

  return (
    <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center justify-center w-full">
          {/* 3. The image preview is gone. The drop zone is always visible. */}
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100"
          >
             <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <CloudUpload className="w-10 h-10 mb-4 text-slate-500" />
              <p className="mb-2 text-sm text-slate-700">
                <span className="font-semibold text-blue-600">Choose an image</span>
              </p>
              <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
          
          {selectedFile && !results && !error && (
            <div className="flex items-center mt-4 text-sm text-slate-600">
              <FileImage className="w-4 h-4 mr-2" />
              <span>{selectedFile.name}</span>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading || !selectedFile}
          className="w-full mt-6 h-12 text-lg"
        >
          {isLoading ? 'Analyzing...' : 'Identify Objects'}
        </Button>

        {error && <p className="text-red-500 mt-4 text-center">Error: {error}</p>}

        {/* 4. This is the main output now: a summary of object counts. */}
        {results && Object.keys(objectCounts).length > 0 && (
          <div className="mt-6 p-4 border rounded-md w-full bg-slate-50">
            <h3 className="font-semibold text-slate-800 mb-2">Detected Objects:</h3>
            <ul className="list-disc pl-5">
              {Object.entries(objectCounts).map(([label, count]) => (
                <li key={label} className="text-slate-700 capitalize">{label}: <span className="font-bold">{count}</span></li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}