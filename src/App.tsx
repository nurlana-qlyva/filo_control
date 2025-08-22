import { Route, Routes } from "react-router-dom"
import RootLayout from "./_root/RootLayout"
import Vehicles from "./_root/pages/vehicle-control/vehicles/Vehicles"
import DetailUpdate from "./_root/pages/vehicle-control/vehicle-detail/DetailUpdate"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />} >
        <Route path="/araclar" element={<Vehicles />} />
        <Route path="/detay/:id" element={<DetailUpdate />} />

      </Route>
    </Routes>
  )
}

export default App
