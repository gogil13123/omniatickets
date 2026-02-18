import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TermsPage from './pages/TermsPage';
import PurchasePage from './pages/PurchasePage';
import AdminPage from './pages/AdminPage';
import SecurityPage from './pages/SecurityPage';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-deep-purple text-white font-sans selection:bg-accent-purple selection:text-white flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/purchase" element={<PurchasePage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/security" element={<SecurityPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
