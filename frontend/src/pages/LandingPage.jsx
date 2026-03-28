import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiOutlineUserAdd, HiOutlineTruck, HiOutlineX } from 'react-icons/hi';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    town: '',
    area: ''
  });

  const handleUserEntry = () => {
    localStorage.setItem('role', 'user');
    navigate('/dashboard');
  };

  const handleCollectorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let collectorId = null;
      const payload = {
        name: formData.name,
        email: formData.email,
        type: "individual",
        acceptedTypes: ["organic", "plastic", "metal", "glass", "paper", "electronic", "hazardous", "other"],
        location: {
          town: formData.town,
          area: formData.area
        }
      };

      try {
        const res = await axios.post('/api/collector/join', payload);
        collectorId = res.data.data._id;
      } catch (err) {
        if (err.response?.status === 400 && err.response.data.message.includes('exists')) {
          // Fallback logic to retrieve existing pseudo-login for the hackathon
          const listRes = await axios.get('/api/collector');
          const existing = listRes.data.data.find(c => c.email === formData.email);
          if (existing) {
            collectorId = existing._id;
          } else {
            throw new Error("Could not find existing collector profile.");
          }
        } else {
          throw err;
        }
      }

      localStorage.setItem('role', 'collector');
      localStorage.setItem('collectorId', collectorId);
      navigate('/dashboard');

    } catch (error) {
      alert("Error joining as collector: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 bg-gradient-to-b from-primary-50 to-surface">
      
      {/* Hero Content */}
      <div className="text-center max-w-2xl mx-auto animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-600/20">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <path d="M8 12l3 3 5-5"/>
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 shrink tracking-tight">
          Welcome to <span className="text-primary-600">RecycleIt</span>
        </h1>
        <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-xl mx-auto">
          The Living Ledger for community waste management. Share your waste details or step up as a collector to clean our neighborhoods together.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <button 
            onClick={handleUserEntry}
            className="flex flex-col items-center gap-2 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
              <HiOutlineUserAdd className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-bold text-gray-900 group-hover:text-primary-600 transition-colors">Enter as User</span>
              <span className="block text-xs text-gray-400 mt-1">To share your waste details</span>
            </div>
          </button>

          <button 
            onClick={() => setShowModal(true)}
            className="flex flex-col items-center gap-2 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-gray-800 group-hover:text-white transition-colors duration-300">
              <HiOutlineTruck className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-bold text-gray-900 group-hover:text-gray-800 transition-colors">Enter as Collector</span>
              <span className="block text-xs text-gray-400 mt-1">To pickup and collect</span>
            </div>
          </button>
        </div>
      </div>

      {/* Collector Sign-in Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Collector Details</h3>
            <p className="text-sm text-gray-500 mb-6">Enter your details to generate your session identity over the ledger.</p>

            <form onSubmit={handleCollectorSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Name *</label>
                <input required autoFocus type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder="Shyam" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder="abc@gmail.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Town *</label>
                  <input required type="text" value={formData.town} onChange={e => setFormData({...formData, town: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder="Kolkata" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Area *</label>
                  <input required type="text" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder="Sector V" />
                </div>
              </div>

              <button disabled={loading} type="submit" className="w-full mt-4 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold font-sm shadow-xl shadow-gray-900/10 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none">
                {loading ? 'Entering...' : 'Enter Dashboard'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
