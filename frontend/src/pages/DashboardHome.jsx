import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  HiOutlineCheck,
  HiOutlineChatAlt2,
  HiOutlineTruck,
  HiOutlineFilter,
  HiOutlineLocationMarker,
  HiOutlineScale,
  HiOutlineArrowRight,
} from 'react-icons/hi';

const emojiMap = {
  organic: '🌿', plastic: '🚰', metal: '⚙️', glass: '🍾', paper: '📄', electronic: '💻', hazardous: '☢️', other: '🗑️'
};

const colorMap = {
  organic: '#5C3A1E', plastic: '#1E3A8A', metal: '#4B5563', glass: '#065F46', paper: '#92400E', electronic: '#1F2937', hazardous: '#B91C1C', other: '#4B5563'
};

export default function DashboardHome() {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'user';

  useEffect(() => {
    if (role !== 'collector') {
      setLoading(false);
      return;
    }
    const fetchWastes = async () => {
      try {
        const res = await axios.get('/api/waste/all');
        const wastes = res.data.data
          .filter(w => w.status === 'reported')
          .map(w => ({
            id: w._id,
            title: (w.type?.charAt(0).toUpperCase() + w.type?.slice(1)) + ' Waste',
            location: `${w.area || ''}, ${w.town || ''}`.trim().replace(/^,\s/, ''),
            weight: w.description ? (w.description.substring(0, 15) + (w.description.length > 15 ? '...' : '')) : 'Unknown',
            urgent: true,
            color: colorMap[w.type] || colorMap.other,
            emoji: emojiMap[w.type] || emojiMap.other,
          }));
        setFeedItems(wastes);
      } catch (error) {
        console.error("Error fetching wastes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWastes();
  }, [role]);

  const handleConnect = async (wasteId) => {
    const collectorId = localStorage.getItem('collectorId');
    if (!collectorId) {
      alert("Collector session not found. Please re-enter from landing page.");
      navigate('/');
      return;
    }
    try {
      await axios.post('/api/pickup/create', { collectorId, wasteId });
      alert("Connected! An email has been sent with further details.");
      setFeedItems(prev => prev.filter(item => item.id !== wasteId));
    } catch (error) {
      alert("Failed to connect: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ── Impact Stats Banner ── */}
      <section className="flex items-stretch bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in">
        <div className="flex-1 p-6 px-8">
          <span className="block text-[0.65rem] font-bold tracking-widest uppercase text-gray-500 mb-1">
            Monthly Impact
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[2.75rem] font-extrabold text-gray-900 leading-none tracking-tight">
              1,284
            </span>
            <span className="text-base font-bold text-gray-500">KG</span>
          </div>
          <span className="block text-sm text-gray-400 mt-1">Waste Delivered This Month</span>
        </div>
        <div className="flex-1 p-6 px-8 text-right">
          <span className="block text-[0.65rem] font-bold tracking-widest uppercase text-gray-500 mb-1">
            Carbon Footprint
          </span>
          <div className="flex items-baseline gap-1.5 justify-end">
            <span className="text-[2.75rem] font-extrabold text-primary-600 leading-none tracking-tight italic">
              412
            </span>
            <span className="text-base font-bold text-primary-600">KG</span>
          </div>
          <span className="block text-sm text-gray-400 mt-1">Kg CO2 Saved</span>
        </div>
      </section>

      {/* ── Active Collection Status ── */}
      <section className="bg-white rounded-2xl shadow-sm p-6 px-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-900">Active Collection Status</h3>
          <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full border border-gray-300 text-gray-600 bg-white">
            In Progress
          </span>
        </div>
        <div className="flex items-center py-3">
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-2.5 relative z-10">
            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-[0_0_0_4px_rgba(22,163,74,0.15)]">
              <HiOutlineCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-gray-500">Waste Food</span>
          </div>
          {/* Line completed */}
          <div className="flex-1 h-[3px] bg-primary-600 rounded-full mx-1 mb-7" />
          {/* Step 2 */}
          <div className="flex flex-col items-center gap-2.5 relative z-10">
            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-[0_0_0_4px_rgba(22,163,74,0.15)]">
              <HiOutlineChatAlt2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-gray-500">Contacted</span>
          </div>
          {/* Line pending */}
          <div className="flex-1 h-[3px] bg-gray-200 rounded-full mx-1 mb-7" />
          {/* Step 3 */}
          <div className="flex flex-col items-center gap-2.5 relative z-10">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center border-2 border-gray-200">
              <HiOutlineTruck className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-gray-500">Picked up</span>
          </div>
        </div>
      </section>

      {/* ── Role Based Action Area ── */}
      {role === 'collector' ? (
        <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Browse Feed</h3>
              <p className="text-sm text-gray-400 mt-0.5">Nearby collection opportunities</p>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-600 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer">
              <HiOutlineFilter className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {feedItems.length === 0 && !loading && (
              <p className="text-sm text-gray-500 py-4 text-center bg-white rounded-2xl border border-dashed border-gray-200">No new waste available right now!</p>
            )}
            {feedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white rounded-2xl p-4 px-5 shadow-sm border border-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Thumb */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: item.color }}
                >
                  <span className="text-2xl">{item.emoji}</span>
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-bold text-gray-900">{item.title}</span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                      <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                      <HiOutlineScale className="w-3.5 h-3.5" />
                      {item.weight}
                    </span>
                  </div>
                  {item.urgent && (
                    <span className="inline-block mt-1.5 text-[0.6rem] font-extrabold tracking-wide text-white bg-red-500 px-2 py-0.5 rounded">
                      URGENT+
                    </span>
                  )}
                </div>
                {/* Connect */}
                <button 
                  onClick={() => handleConnect(item.id)}
                  className="px-5 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shrink-0"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-extrabold text-white mb-2">Have Waste to Report?</h3>
              <p className="text-primary-100 max-w-md text-sm leading-relaxed">
                Add your waste to the ledger and allow local collectors and recycling bodies to safely pick it up from your location.
              </p>
            </div>
            <button 
              onClick={() => navigate('/report')}
              className="relative z-10 shrink-0 flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-2xl text-md font-bold hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all cursor-pointer group"
            >
              Add Waste
              <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      )}

      
    </div>
  );
}
