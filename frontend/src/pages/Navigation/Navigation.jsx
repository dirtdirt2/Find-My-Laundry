import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { ChevronLeft, Search, X } from "lucide-react";
import { useState } from "react";
import "./Navigation.css";
import MapControls from "./MapControls";
import { createLaundryIcon } from "./navigationFunctions";

function Navigation() {

    const [selectedShop, setSelectedShop] = useState(null);
    const shop = {
        name: "FreshFold Laundry",
        rating: "4.8",
        distance: "0.4 km away",
        closingTime: "Open until 8 PM",
        price: "35",
        services: ["Wash", "Ironing", "Drying"],
        status: "Open",
        position: [13.6218, 123.1948],
    };

    return (
        <div className="navigationPage">
            <MapContainer
                center={[13.6218, 123.1948]}
                zoom={15}
                zoomControl={false}
                style={{ height: "100dvh", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                    position={shop.position}
                    icon={createLaundryIcon(shop.price)}
                    eventHandlers={{
                        click: () => setSelectedShop(shop),
                    }}
                />

                <MapControls />
            </MapContainer>

            {selectedShop && (
                <div className="shopPanel">
                    <div className="shopPanelHandle"></div>

                    <button
                        className="closePanelButton"
                        onClick={() => setSelectedShop(null)}
                    >
                        <X size={18} strokeWidth={2} />
                    </button>

                    <span className="shopLabel">SELECTED SHOP</span>

                    <div className="shopHeader">
                        <div className="shopIcon"></div>

                        <div className="shopInfo">
                            <h2>{selectedShop.name}</h2>

                            <p className="shopMeta">
                                <span>★ {selectedShop.rating}</span>
                                {" · "}
                                {selectedShop.distance}
                                {" · "}
                                {selectedShop.closingTime}
                            </p>

                            <p className="shopServices">
                                Self-Service • Full-Service
                            </p>
                        </div>

                        <span className="shopStatus">
                            <span className="statusDot"></span>
                            {selectedShop.status}
                        </span>
                    </div>

                    <div className="shopPrice">
                        <span>PRICE:</span>

                        <div className="priceGroup">
                            <strong className="priceAmount">
                                ₱{selectedShop.price}
                            </strong>

                            <span className="priceUnit">/kg</span>
                        </div>
                    </div>

                    <div className="serviceTags">
                        {selectedShop.services.map((service) => (
                            <span key={service}>{service}</span>
                        ))}
                    </div>

                    <button className="shopDetailsButton">
                        Shop details
                    </button>
                </div>
            )}

            <div className="topControls">
                <button className="backButton">
                    <ChevronLeft size={22} strokeWidth={2} />
                </button>

                <div className="searchBar">
                    <Search size={20} color="#808080" />

                    <input
                        type="text"
                        placeholder="Search laundry shops..."
                    />
                </div>
            </div>
        </div>
    );
}

export default Navigation;