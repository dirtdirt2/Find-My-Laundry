import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { ChevronLeft, Search, ZoomIn, ZoomOut, X } from "lucide-react";
import { useState } from "react";
import L from "leaflet";
import "../styles/Navigation.css";

function createLaundryIcon(price) {
    return L.divIcon({
        className: "laundryMarkerWrapper",
        html: `
            <div class="laundryMarker">
                <div class="laundryPin">
                    <svg viewBox="0 0 24 24" width="22" height="22"
                        fill="none" stroke="#FFFFFF"
                        stroke-width="1.8" stroke-linecap="round"
                        stroke-linejoin="round">
                        <rect x="4" y="3" width="16" height="18" rx="2"/>
                        <circle cx="12" cy="13" r="5"/>
                        <circle cx="8" cy="6.5" r="0.7" fill="#242424"/>
                        <circle cx="11" cy="6.5" r="0.7" fill="#242424"/>
                    </svg>
                </div>
                <div class="laundryPrice">${price}</div>
            </div>
        `,
        iconSize: [150, 58],
        iconAnchor: [25, 58],
    });
}

function MapControls() {
    const map = useMap();

    const handleCurrentLocation = () => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            map.flyTo([latitude, longitude], 16);
        });
    };

    return (
        <div className="mapControls">
            <button
                className="mapControlButton"
                onClick={(e) => {
                    e.stopPropagation();
                    handleCurrentLocation();
                }}
            >
                <svg width="26" height="26" viewBox="0 0 26 26">
                    <circle
                        cx="13"
                        cy="13"
                        r="12"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="1"
                    />
                    <circle
                        cx="13"
                        cy="13"
                        r="10"
                        fill="#40C2FF"
                        stroke="#000000"
                        strokeWidth="1"
                    />
                </svg>
            </button>

            <button
                className="mapControlButton"
                onClick={() => map.zoomIn()}
            >
                <ZoomIn size={35} strokeWidth={1.8} />
            </button>

            <button
                className="mapControlButton"
                onClick={() => map.zoomOut()}
            >
                <ZoomOut size={35} strokeWidth={1.8} />
            </button>
        </div>
    );
}

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