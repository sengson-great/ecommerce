import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Auth from "./pages/auth/Auth"
import Shop from "./pages/shop/Shop"
import Checkout from "./pages/checkout/Checkout"
import PurchasedItems from "./pages/purchased-items/PurchasedItems"


function App() {

  return (
    <>
      <BrowserRouter>
       <Navbar />
        <Routes>
          <Route path="/" element={<Shop/>}/>
          <Route path="/auth" element={<Auth/>}/>
          <Route path="/checkout" element={<Checkout/>}/>
          <Route path="/purchased-items" element={<PurchasedItems/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
