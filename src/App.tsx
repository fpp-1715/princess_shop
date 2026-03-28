import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingCartButton from './components/FloatingCartButton';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/admin' element={<AdminLogin />} />
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <FloatingCartButton />
      </div>
    </Router>
  );
}
