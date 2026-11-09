import L from "leaflet"

export function createLaundryIcon(price) {
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