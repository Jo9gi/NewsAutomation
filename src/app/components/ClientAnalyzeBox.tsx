'use client';

import dynamic from 'next/dynamic';

const AnalyzeBox = dynamic(() => import('@/components/AnalyzeBox'), { ssr: false });

export default function ClientAnalyzeBox() {
  return <AnalyzeBox />;
}