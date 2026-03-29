import { useState, useEffect } from 'react';
import axios from 'axios';
import { HiOutlineLocationMarker, HiOutlineScale, HiOutlineMap } from 'react-icons/hi';

const getCategoryInfo = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes('food') || t.includes('organic')) return { emoji: '🥕', color: '#8B5E3C' };
  if (t.includes('plastic') || t.includes('bottle')) return { emoji: '🥤', color: '#3A5E8B' };
  if (t.includes('paper') || t.includes('cardboard')) return { emoji: '📦', color: '#8B7B3C' };
  if (t.includes('electronic') || t.includes('e-waste')) return { emoji: '🔌', color: '#5E3A8B' };
  return { emoji: '♻️', color: '#3D5E3A' };
};

export default function CollectorHistory() {
  const [pickups, setPickups] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const collectorId = localStorage.getItem('collectorId');

  useEffect(() => {
    if (collectorId) {
      fetchHistory();
    }
  }, [collectorId]);

  const fetchHistory = () => {
    axios.get(`/api/pickup/collector/${collectorId}`)
      .then(res => setPickups(res.data))
      .catch(console.error);
  };

  const handleCancelClick = async (pickupId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this pickup? This will make the waste available to other collectors again.");
    if (!confirmCancel) return;

    setLoadingId(pickupId);
    try {
      await axios.put(`/api/pickup/${pickupId}/status`, { status: 'cancelled' });
      fetchHistory(); // Refresh
    } catch (err) {
      alert("Error cancelling pickup: " + (err.response?.data?.message || err.message));
    } finally {
      setLoadingId(null);
    }
  };

  const handleCompleteClick = async (pickupId) => {
    const confirmComplete = window.confirm("Are you sure you have collected this waste? This cannot be undone.");
    if (!confirmComplete) return;

    setLoadingId(pickupId);
    try {
      await axios.put(`/api/pickup/${pickupId}/status`, { status: 'completed' });
      fetchHistory(); // Refresh
    } catch (err) {
      alert("Error marking as completed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="mb-2">
        <h2 className="text-2xl font-extrabold text-gray-900">Your Connection History</h2>
        <p className="text-sm text-gray-500 mt-1">Manage all the waste pickups you have committed to.</p>
      </div>

      <div className="flex flex-col gap-3">
        {pickups.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-4xl inline-block mb-3 opacity-50">📭</span>
            <p className="text-gray-500 font-medium">No pickup history found.</p>
          </div>
        ) : (
          pickups.map((pickup) => {
            const item = pickup.waste;
            // Sometimes waste might be null if it was deleted
            const safeItem = item || { type: 'Unknown', area: 'Unknown', town: 'Unknown', status: 'deleted' };
            const { emoji, color } = getCategoryInfo(safeItem.type);

            return (
              <div
                key={pickup._id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-2xl p-4 px-5 shadow-sm border border-gray-50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4 flex-1">
                  {safeItem.image ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        <img src={safeItem.image} alt={safeItem.type} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: color }}
                    >
                      <span className="text-2xl">{emoji}</span>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="block text-sm font-bold text-gray-900 capitalize">{safeItem.type}</span>
                        {pickup.status === 'accepted' && (
                          <span className="inline-block text-[0.6rem] font-extrabold tracking-wide text-primary-700 bg-primary-100 px-2 py-0.5 rounded uppercase border border-primary-200">
                            ACCEPTED - IN PROGRESS
                          </span>
                        )}
                        {pickup.status === 'cancelled' && (
                          <span className="inline-block text-[0.6rem] font-extrabold tracking-wide text-gray-700 bg-gray-100 px-2 py-0.5 rounded uppercase border border-gray-200">
                            CANCELLED
                          </span>
                        )}
                        {pickup.status === 'completed' && (
                          <span className="inline-block text-[0.6rem] font-extrabold tracking-wide text-green-700 bg-green-100 px-2 py-0.5 rounded uppercase border border-green-200">
                            COMPLETED
                          </span>
                        )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                        <HiOutlineLocationMarker className="w-3.5 h-3.5 text-gray-400" />
                        {safeItem.area ? `${safeItem.area}, ${safeItem.town}` : 'Location unknown'}
                      </span>
                      
                      {(safeItem.quantity || safeItem.quantity === 0) && (
                          <span className="flex items-center gap-1 text-xs text-gray-500 font-medium border-l border-gray-200 pl-3">
                            <HiOutlineScale className="w-3.5 h-3.5 text-gray-400" />
                            {safeItem.quantity} KG
                          </span>
                      )}

                      {safeItem.mapLink && (
                          <a href={safeItem.mapLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-500 font-medium hover:text-blue-600 border-l border-gray-200 pl-3">
                            <HiOutlineMap className="w-3.5 h-3.5" />
                            Map Link
                          </a>
                      )}
                    </div>
                  </div>
                </div>

                {pickup.status === 'accepted' && (
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0 shrink-0">
                    <button 
                      disabled={loadingId === pickup._id}
                      onClick={() => handleCancelClick(pickup._id)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loadingId === pickup._id ? 'Cancelling...' : 'Cancel'}
                    </button>
                    <button 
                      disabled={loadingId === pickup._id}
                      onClick={() => handleCompleteClick(pickup._id)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary-600 border border-transparent text-white text-sm font-semibold hover:bg-primary-700 hover:shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loadingId === pickup._id ? 'Processing...' : 'Mark as Picked Up'}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
