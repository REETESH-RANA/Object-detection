// In file: app/page.tsx

import { ImageAnalyzer } from "@/components/image-analyzer";

export default function Home() {
  return (
    <main  className="flex flex-col items-center p-4 sm:p-24 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-800">
          Image Identifier
        </h1>
        <p className="text-lg text-slate-600 mt-2">
          Upload an image to analyze and identify objects
        </p>
      </div>
      <ImageAnalyzer />
    </main>
  );
}