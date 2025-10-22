import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { UserProvider } from './contexts/Context';
import NavBar from './components/Navbar';

// Components
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import About from './pages/About';
import Vacations from './pages/Vacations';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import VacationStats from './pages/admin/VacationStats';
import UserStats from './pages/admin/UserStats';
import LikesStats from './pages/admin/LikesStats';
import ReportsPage from './pages/admin/ReportsPage';
import AdminAbout from './pages/admin/AdminAbout';
import EditVacation from './components/admin/EditVacation';
import AddVacation from './components/admin/AddVacation';


// Admin Components
import AdminRoute from './components/admin/AdminRoute';
import GuestRoute from './components/GuestRoute'; // ← חדש!

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <Router>
          <NavBar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Vacations />} />
            <Route path="/about" element={<About />} />
            <Route path="/vacations" element={<Vacations />} />
            <Route path="*" element={<Vacations />} />

            {/* Guest Only Routes - חסום למי שכבר מחובר */}
            <Route 
              path="/login" 
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              } 
            />
            


            {/* Protected Routes - למי שמחובר */}

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
            

            {/* Admin Only Routes */}
               <Route 
                  path="/addvacation" 
                  element={
                    <AdminRoute>
                      <AddVacation />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/editvacation/:id" 
                  element={
                    <AdminRoute>
                      <EditVacation />
                    </AdminRoute>
                  } 
                />
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/vacation-stats" 
              element={
                <AdminRoute>
                  <VacationStats />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/user-stats" 
              element={
                <AdminRoute>
                  <UserStats />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/likes-stats" 
              element={
                <AdminRoute>
                  <LikesStats />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <AdminRoute>
                  <ReportsPage />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/about" 
              element={
                <AdminRoute>
                  <AdminAbout />
                </AdminRoute>
              } 
            />
            
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
