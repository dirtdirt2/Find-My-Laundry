import { Star, MapPin, Shirt } from "lucide-react";

// one shop card in the list
export default function ShopCard({ shop, landmark = "Magsaysay Ave" }) {
  const { name, rating, distanceKm, price, unit, image } = shop;

  return (
    <article className="sr-card">
      {/* picture, shows a shirt icon if there's no image yet */}
      <div className="sr-card-photo">
        {image ? (
          <img src={image} alt={name} />
        ) : (
          <div className="sr-card-placeholder">
            <Shirt size={28} />
          </div>
        )}
      </div>

      {/* shop info */}
      <div className="sr-card-body">
        <h3 className="sr-card-name">{name}</h3>

        {/* star rating */}
        <div className="sr-card-rating">
          <Star size={13} className="sr-star" />
          <span>{rating.toFixed(1)}</span>
        </div>

        {/* how far the shop is */}
        <div className="sr-card-distance">
          <MapPin size={12} />
          <span>
            {distanceKm} km from {landmark}
          </span>
        </div>

        {/* price */}
        <p className="sr-card-price">
          Starts at{" "}
          <strong>
            ₱{price}/{unit}
          </strong>
        </p>
      </div>
    </article>
  );
}