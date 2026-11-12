
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import CustomerLaundryShopDetail from "./pages/LaundryShopDetail/Customer/LaundryShopDetail";
import OwnerLaundryShopDetail from "./pages/LaundryShopDetail/Owner/LaundryShopDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Page */}
        <Route
          path="/customer/laundry-shop/:id"
          element={<CustomerLaundryShopDetail />}
        />

        {/* Owner Page */}
        <Route
          path="/owner/laundry-shop/:id"
          element={<OwnerLaundryShopDetail />}
        />

        {/* Default Page */}
        <Route
          path="/"
          element={<Navigate to="/customer/laundry-shop/1" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
