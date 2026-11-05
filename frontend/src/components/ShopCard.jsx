import { Star, MapPin, Shirt } from "lucide-react";

export default function ShopCard({ shop, landmark = "Magsaysay Ave" }) {
  const { name, rating, distanceKm, price, unit, image } = shop;

  return (
    <article className="flex gap-3 rounded-2xl bg-white p-2.5 shadow-[0_2px_10px_rgba(16,24,40,0.08)] transition-transform active:scale-[0.98]">
      <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
        {image ? (
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-gray-300">
            <Shirt size={28} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
        <h3 className="truncate text-[14px] font-semibold leading-5 text-gray-900">
          {name}
        </h3>

        <div className="flex items-center gap-1">
          <Star size={13} className="fill-yellow-400 text-yellow-400" />
          <span className="text-[12px] font-semibold text-gray-800">
            {rating.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-gray-500">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate text-[11px]">
            {distanceKm} km from {landmark}
          </span>
        </div>

        <p className="text-[11px] text-gray-500">
          Starts at{" "}
          <span className="text-[14px] font-bold text-gray-900">
            ₱{price}/{unit}
          </span>
        </p>
      </div>
    </article>
  );
}
