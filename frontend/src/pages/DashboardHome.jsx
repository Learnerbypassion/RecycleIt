import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  HiOutlineFilter,
  HiOutlineLocationMarker,
  HiOutlineScale,
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineDocumentText,
  HiOutlineMap,
  HiCheckCircle,
  HiXCircle
} from 'react-icons/hi';
import ActiveCollectionStatus from '../components/ActiveCollectionStatus';

const getCategoryInfo = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes('food') || t.includes('organic')) return { emoji: '🥕', color: '#8B5E3C' };
  if (t.includes('plastic') || t.includes('bottle')) return { emoji: '🥤', color: '#3A5E8B' };
  if (t.includes('paper') || t.includes('cardboard')) return { emoji: '📦', color: '#8B7B3C' };
  if (t.includes('electronic') || t.includes('e-waste')) return { emoji: '🔌', color: '#5E3A8B' };
  return { emoji: '♻️', color: '#3D5E3A' };
};

export default function DashboardHome() {
  const role = localStorage.getItem('role') || 'user';
  const acceptedTypes = JSON.parse(localStorage.getItem('acceptedTypes') || '[]');
  const [wasteList, setWasteList] = useState([]);
  const [activeWaste, setActiveWaste] = useState(null);
  const [connectingId, setConnectingId] = useState(null);
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });
  const userEmail = localStorage.getItem('userEmail');

  // Remove unused justCompleted state

  const fetchUserWaste = (email) => {
    return axios.get(`/api/waste/user/${email}`)
      .then(res => {
        const wastes = res.data?.data || [];
        if (wastes.length > 0) {
          const sortedWastes = [...wastes].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          const absoluteLatest = sortedWastes[0];
          
          if (absoluteLatest.status === 'reported' || absoluteLatest.status === 'assigned') {
            setActiveWaste(absoluteLatest);
          } else {
            setActiveWaste(null);
          }
        } else {
          setActiveWaste(null);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (role === 'collector') {
      axios.get('/api/waste/all')
        .then(res => {
          if (res.data && res.data.data) {
            setWasteList(res.data.data.filter(w => {
              if (w.status !== 'reported') return false;
              const safeType = (w.type || "").toLowerCase();
              return acceptedTypes.map(t => t.toLowerCase()).includes(safeType);
            }));
          }
        })
        .catch(console.error);
    } else if (role === 'user' && userEmail) {
      // Initial fetch
      fetchUserWaste(userEmail);
      // Poll every 10 seconds to detect when collector marks as completed
      const interval = setInterval(() => fetchUserWaste(userEmail), 10000);
      return () => clearInterval(interval);
    }
  }, [role, userEmail]);

  const handleConnect = async (item) => {
    const collectorId = localStorage.getItem('collectorId');
    if (!collectorId) {
      setPopup({ show: true, type: 'error', message: 'You must be logged in as a collector to connect.' });
      return;
    }

    setConnectingId(item._id);
    try {
      await axios.post('/api/pickup/create', { collectorId, wasteId: item._id });
      setPopup({ show: true, type: 'success', message: `Successfully connected for ${item.type}. An email has been sent to you with pickup details.` });
      setWasteList(prev => prev.filter(w => w._id !== item._id));
    } catch (err) {
      setPopup({ show: true, type: 'error', message: err.response?.data?.message || err.message });
    } finally {
      setConnectingId(null);
    }
  };

  if (role === 'user') {
    return (
      <div className="flex flex-col animate-fade-in sm:p-4 max-w-4xl mx-auto w-full">
        {activeWaste && (
           <ActiveCollectionStatus waste={activeWaste} showDetails={true} />
        )}
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-6 mt-4">
          <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mb-2 border-4 border-primary-100/50 shadow-sm transition-all hover:shadow-md">
             <HiOutlineSparkles className="w-12 h-12" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Welcome back!</h2>
          <p className="text-gray-500 max-w-lg text-base font-medium leading-relaxed">
           Press the Report Waste button to log unwanted waste in your locality and track its collection status!
          </p>
          <Link to="/report" className="mt-4 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(22,163,74,0.3)] hover:shadow-[0_6px_25px_rgba(22,163,74,0.4)] transition-all duration-200 flex items-center gap-2">
            <HiOutlineDocumentText className="w-5 h-5 opacity-80" />
            Report New Waste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Waste Feed</h3>
            <p className="text-sm text-gray-400 mt-0.5">Nearby collection opportunities</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-600 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer">
            <HiOutlineFilter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {wasteList.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-4xl inline-block mb-3 opacity-50">🍃</span>
              <p className="text-gray-500 font-medium">No waste reported nearby yet.</p>
            </div>
          ) : (
            wasteList.map((item) => {
              const { emoji, color } = getCategoryInfo(item.type);
              
              return (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-2xl p-4 px-5 shadow-sm border border-gray-50 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Thumb */}
                    {item.image ? (
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                         <img src={item.image} alt={item.type} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: color }}
                      >
                        <span className="text-2xl">{emoji}</span>
                      </div>
                    )}
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                         <span className="block text-sm font-bold text-gray-900 capitalize">{item.type}</span>
                         {item.status === 'pending' && (
                           <span className="inline-block text-[0.6rem] font-extrabold tracking-wide text-white bg-amber-500 px-2 py-0.5 rounded uppercase">
                             PENDING
                           </span>
                         )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                          <HiOutlineLocationMarker className="w-3.5 h-3.5 text-gray-400" />
                          {item.area ? `${item.area}, ${item.town}` : 'Location unknown'}
                        </span>
                        
                        {(item.quantity || item.quantity === 0) && (
                           <span className="flex items-center gap-1 text-xs text-gray-500 font-medium border-l border-gray-200 pl-3">
                             <HiOutlineScale className="w-3.5 h-3.5 text-gray-400" />
                             {item.quantity} KG
                           </span>
                        )}

                        {item.mapLink && (
                           <a href={item.mapLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-500 font-medium hover:text-blue-600 border-l border-gray-200 pl-3">
                             <HiOutlineMap className="w-3.5 h-3.5" />
                             Map Link
                           </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Connect */}
                  <button 
                    disabled={connectingId === item._id}
                    onClick={() => handleConnect(item)}
                    className="w-full sm:w-auto px-5 py-2.5 mt-2 sm:mt-0 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 hover:shadow-[0_4px_12px_rgba(22,163,74,0.25)] transition-all duration-200 cursor-pointer shrink-0 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {connectingId === item._id && (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    )}
                    {connectingId === item._id ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Confirmation Popup */}
      {popup.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-center">
            <button 
              onClick={() => setPopup({ show: false, type: '', message: '' })}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <HiXCircle className="w-6 h-6" />
            </button>
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${popup.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {popup.type === 'success' ? <HiCheckCircle className="w-8 h-8" /> : <HiXCircle className="w-8 h-8" />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{popup.type === 'success' ? 'Success!' : 'Error'}</h3>
            <p className="text-sm text-gray-500 mb-6">{popup.message}</p>
            <button 
              onClick={() => setPopup({ show: false, type: '', message: '' })}
              className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm shadow-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}