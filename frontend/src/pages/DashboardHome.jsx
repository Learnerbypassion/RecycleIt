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
  HiOutlineMap
} from 'react-icons/hi';

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
  const [wasteList, setWasteList] = useState([]);

  useEffect(() => {
    if (role === 'collector') {
      axios.get('/api/waste/all')
        .then(res => {
          if (res.data && res.data.data) {
            setWasteList(res.data.data);
          }
        })
        .catch(console.error);
    }
  }, [role]);

  const handleConnect = (item) => {
    alert(`Connecting pickup for ${item.type}...`);
  };

  if (role === 'user') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 animate-fade-in p-6">
        <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mb-4 border-4 border-primary-100/50 shadow-sm transition-all hover:scale-105">
           <HiOutlineSparkles className="w-12 h-12" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Welcome back!</h2>
        <p className="text-gray-500 max-w-lg text-base font-medium leading-relaxed">
         Press On the add Waste Button to report unwanted waste in your locality</p>
        <Link to="/report" className="mt-4 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(22,163,74,0.3)] hover:shadow-[0_6px_25px_rgba(22,163,74,0.4)] hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
          <HiOutlineDocumentText className="w-5 h-5 opacity-80" />
          Report New Waste
        </Link>
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
                  className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-2xl p-4 px-5 shadow-sm border border-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
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
                    onClick={() => handleConnect(item)}
                    className="w-full sm:w-auto px-5 py-2.5 mt-2 sm:mt-0 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 hover:shadow-[0_4px_12px_rgba(22,163,74,0.25)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shrink-0"
                  >
                    Connect
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

    </div>
  );
}