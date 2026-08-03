import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ProfileInput from './pages/ProfileInput';
import Dashboard from './pages/Dashboard';
import Optimize from './pages/Optimize';
import Compare from './pages/Compare';
import Simulate from './pages/Simulate';

function AnimatedRoutes() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      {!isLanding && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<ProfileInput />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/optimize" element={<Optimize />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/simulate" element={<Simulate />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <ChatWidget />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AnimatedRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
