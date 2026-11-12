
import { useState } from "react";
import {
  Phone,
  Bookmark,
  MapPin,
} from "lucide-react";

import "./LaundryShopDetail.css";

const services = [
  { name: "Wash per kg", price: "₱35" },
  { name: "Ironing", price: "₱15 / pc" },
  { name: "Drying", price: "₱30 / kg" },
  { name: "Plastic / Packaging", price: "₱5" }
];

const reviews = [
  {
    name: "Naruto Uzumaki",
    rating: 5,
    comment: "Very clean shop and friendly staff. My clothes smell fresh!"
  },
  {
    name: "Saitama",
    rating: 5,
    comment: "Fast service and affordable prices. Highly recommended!"
  },
  {
    name: "Sakura Haruno",
    rating: 4,
    comment: "Good service and the staff are very accommodating."
  }
];

function LaundryShopDetail() {
  const [saved, setSaved] = useState(false);

  const handleCall = () => {
    window.location.href = "tel:+639123456789";
  };

  return (
    <div className="shop-screen">

      <div className="shop-container">

        {/* Header */}
        <header className="shop-header">
          <h2>Laundry Shop Detail</h2>
        </header>

        {/* Shop Image */}
        <div className="shop-image-wrapper">
          <img
            src="/laundry-shop.jpg"
            alt="FreshFold Laundry Shop"
            className="shop-image"
          />
        </div>

        {/* Shop Information */}
        <section className="shop-info">

          <div className="shop-name-row">
            <div>
              <h3>FreshFold Laundry</h3>

              <p className="shop-location">
                <MapPin size={12} />
                Naga City, Camarines Sur
              </p>
            </div>

            <span className="open-status">
              <span className="status-dot"></span>
              Open
            </span>
          </div>

          {/* Action Buttons */}
          <div className="shop-actions">

            <button
              className="call-button"
              onClick={handleCall}
            >
              <Phone size={15} />
              Call Shop
            </button>

            <button
              className={`save-button ${saved ? "saved" : ""}`}
              onClick={() => setSaved(!saved)}
            >
              <Bookmark size={15} />
              {saved ? "Saved" : "Save Shop"}
            </button>

          </div>
        </section>

        {/* Services and Pricing */}
        <section className="shop-section">

          <h3 className="section-title">
            Services & Pricing
          </h3>

          <div className="pricing-card">
            {services.map((service, index) => (
              <div className="price-row" key={index}>
                <span>{service.name}</span>
                <strong>{service.price}</strong>
              </div>
            ))}
          </div>

        </section>

        {/* Operating Hours */}
        <section className="shop-section hours-section">

          <h3 className="section-title">
            Operating Hours
          </h3>

          <div className="hours-row">
            <span>Monday – Sunday</span>
            <strong>8:00 AM – 8:00 PM</strong>
          </div>

        </section>

        {/* Customer Reviews */}
        <section className="reviews-section">

          <h3 className="section-title">
            Customer Reviews
          </h3>

          <div className="rating-summary">
            <div className="stars">★★★★★</div>
            <strong>4.8</strong>
            <span>(128 reviews)</span>
          </div>

          <div className="reviews-list">

            {reviews.map((review, index) => (
              <div className="review-card" key={index}>

                <h4>{review.name}</h4>

                <div className="review-stars">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>

                <p>{review.comment}</p>

              </div>
            ))}

          </div>

        </section>

      </div>
    </div>
  );
}

export default LaundryShopDetail;
