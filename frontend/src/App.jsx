import React from 'react';
import Home from './pages/Home';

export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      {/* Mobile Device Frame (390x844px) */}
      <div className="w-[390px] h-[844px] bg-neutral-600 rounded-[40px] overflow-hidden shadow-2xl border-4 border-slate-700 flex flex-col">
        <Home />
      </div>
    </div>
  );
}