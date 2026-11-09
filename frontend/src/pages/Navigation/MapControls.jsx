import { useMap } from "react-leaflet";
import { ZoomIn, ZoomOut } from "lucide-react";

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

export default MapControls;