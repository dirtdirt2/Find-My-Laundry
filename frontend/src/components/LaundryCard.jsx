import React from 'react';
import { MapPin, Star } from 'lucide-react';

export default function LaundryCard({ shop }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
      {/* Banner Image Container */}
      <div className="relative h-36 w-full bg-slate-200">
        <img 
          src={shop.image} 
          alt={shop.name} 
          className="w-full h-full object-cover"
        />
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
          <span className="text-xs font-bold text-slate-800">{shop.rating}</span>
          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-base font-bold text-slate-900 leading-snug">
          {shop.name}
        </h3>
        
        {/* Services & Price */}
        <p className="text-xs text-slate-500 font-medium">
          {shop.services.join(' • ')} • <span className="text-slate-700 font-semibold">₱{shop.price}/load</span>
        </p>

        {/* Distance & Status */}
        <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-0.5">
          <MapPin className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
          <span>{shop.distance} km away</span>
          <span className="text-slate-300">•</span>
          <span>Open until {shop.openUntil}</span>
        </div>
      </div>
    </div>
  );
}