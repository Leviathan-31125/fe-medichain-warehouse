import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import {PrimeReactProvider} from 'primereact/api';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { PrivateRoute } from './helpers/RouteMiddleware';
import Dashboard from './pages/Dashboard/Dashboard';
import MasterBrand from './pages/MasterBrand/MasterBrand';
import MasterStock from './pages/MasterStock/MasterStock';
import MasterWarehouse from './pages/Warehouse/MasterWarehouse';
import DetailWarehouse from './pages/Warehouse/DetailWarehouse';
import StockOpname from './pages/StockOpname/StockOpname';
import KonversiStock from './pages/KonversiStock/KonversiStock';
import InventoryStock from './pages/InventoryStock/InventoryStock';
import InquiriBP from './pages/InventoryStock/InquiriBP';
import MasterDeliveryOrder from './pages/DeliveryOrder/MasterDeliveryOrder';
import CreateDeliveryOrder from './pages/DeliveryOrder/CreateDeliveryOrder';
import DetailDeliveryOrder from './pages/DeliveryOrder/DetailDeliveryOrder';
import AddStockDeliveryOrder from './pages/DeliveryOrder/AddStockDeliveryOrder';
import DetailDOMST from './pages/DeliveryOrder/DetailDOMST';


function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <Routes>
          <Route
            path='/dashboard'
            element={
              <PrivateRoute>
                <Dashboard/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/master-brand'
            element={
              <PrivateRoute>
                <MasterBrand/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/master-stock'
            element={
              <PrivateRoute>
                <MasterStock/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/master-warehouse'
            element={
              <PrivateRoute>
                <MasterWarehouse/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/master-warehouse/:id'
            element={
              <PrivateRoute>
                <DetailWarehouse/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/stock-opname'
            element={
              <PrivateRoute>
                <StockOpname/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/stock-convert'
            element={
              <PrivateRoute>
                <KonversiStock/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/inventory'
            element={
              <PrivateRoute>
                <InventoryStock/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/inquiri-stock'
            element={
              <PrivateRoute>
                <InquiriBP/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/master-do'
            element={
              <PrivateRoute>
                <MasterDeliveryOrder/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/master-do/detail'
            element={
              <PrivateRoute>
                <DetailDOMST/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/delivery-order'
            element={
              <PrivateRoute>
                <CreateDeliveryOrder/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/delivery-order/detail-so'
            element={
              <PrivateRoute>
                <DetailDeliveryOrder/>
              </PrivateRoute>
            }  
          />
          <Route
            path='/delivery-order/create'
            element={
              <PrivateRoute>
                <AddStockDeliveryOrder/>
              </PrivateRoute>
            }  
          />
        </Routes>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;
