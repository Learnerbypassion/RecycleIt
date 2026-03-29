import { useState, useEffect } from 'react';
import axios from 'axios';
import { HiOutlineLocationMarker, HiOutlineScale, HiChevronDown, HiChevronUp, HiOutlineMail } from 'react-icons/hi';
import ActiveCollectionStatus from '../components/ActiveCollectionStatus';

const getCategoryInfo = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes('food') || t.includes('organic')) return { emoji: '🥕', color: '#8B5E3C' };
  if (t.includes('plastic') || t.includes('bottle')) return { emoji: '🥤', color: '#3A5E8B' };
  if (t.includes('paper') || t.includes('cardboard')) return { emoji: '📦', color: '#8B7B3C' };
  if (t.includes('electronic') || t.includes('e-waste')) return { emoji: '🔌', color: '#5E3A8B' };
  return { emoji: '♻️', color: '#3D5E3A' };
};

export default function UserHistory() {
  const [wastes, setWastes] = useState([]);
  const [openCardId, setOpenCardId] = useState(null);
  const [savedEmail, setSavedEmail] = useState(localStorage.getItem('userEmail') || '');
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    if (savedEmail) {
      axios.get(`/api/waste/user/${savedEmail}`)
        .then(res => setWastes(res.data?.data || []))
        .catch(console.error);
    }
  }, [savedEmail]);

  const toggleCard = (id) => {
    if (openCardId === id) setOpenCardId(null);
    else setOpenCardId(id);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      localStorage.setItem('userEmail', emailInput.trim());
      setSavedEmail(emailInput.trim());
    }
  };

  const clearEmail = () => {
    localStorage.removeItem('userEmail');
    setSavedEmail('');
    setWastes([]);
  };

  if (!savedEmail) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in sm:p-4 max-w-xl mx-auto w-full text-center mt-10">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineMail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Track Your Reports</h2>
          <p className="text-sm text-gray-500 mb-6">Enter the email address you used when reporting waste to view your status and history.</p>
          
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <input 
              required
              type="email" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="e.g. abc@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm outline-none text-center" 
            />
            <button type="submit" className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl shadow-[0_4px_12px_rgba(22,163,74,0.25)] hover:shadow-[0_6px_16px_rgba(22,163,74,0.35)] transition-all">
              View My Reports
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in sm:p-4 max-w-4xl mx-auto w-full">
      <div className="mb-2 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">My Reports</h2>
          <p className="text-sm text-gray-500 mt-1">Track the status of your reported waste for <strong>{savedEmail}</strong>.</p>
        </div>
        <button onClick={clearEmail} className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors bg-gray-50 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-gray-200">
          Change Email
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {wastes.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-4xl inline-block mb-3 opacity-50">🍃</span>
            <p className="text-gray-500 font-medium">No waste reported yet.</p>
          </div>
        ) : (
          wastes.map((item) => {
            const { emoji, color } = getCategoryInfo(item.type);
            const isOpen = openCardId === item._id;

            return (
              <div
                key={item._id}
                onClick={() => toggleCard(item._id)}
                className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-primary-100 transition-all duration-300 cursor-pointer overflow-hidden group"
              >
                <div className="p-4 px-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    {item.image ? (
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100 group-hover:shadow-md transition-shadow">
                          <img src={item.image} alt={item.type} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 group-hover:shadow-md transition-shadow"
                        style={{ background: color }}
                      >
                        <span className="text-2xl">{emoji}</span>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                          <span className="block text-sm font-bold text-gray-900 capitalize">{item.type}</span>
                          {item.status === 'reported' && (
                            <span className="inline-block text-[0.6rem] font-extrabold tracking-wide text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded uppercase border border-yellow-200">
                              REPORTED
                            </span>
                          )}
                          {item.status === 'assigned' && (
                            <span className="inline-block text-[0.6rem] font-extrabold tracking-wide text-primary-700 bg-primary-100 px-2 py-0.5 rounded uppercase border border-primary-200">
                              IN PROGRESS
                            </span>
                          )}
                          {item.status === 'cleared' && (
                            <span className="inline-block text-[0.6rem] font-extrabold tracking-wide text-green-700 bg-green-100 px-2 py-0.5 rounded uppercase border border-green-200">
                              ✓ COMPLETED
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
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 sm:pt-0">
                    <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
                      {isOpen ? <HiChevronUp className="w-5 h-5" /> : <HiChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded State section */}
                <div 
                  className={`bg-gray-50/50 transition-all duration-300 ease-in-out px-6 ${isOpen ? 'max-h-[300px] opacity-100 py-4 border-t border-gray-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  {isOpen && <ActiveCollectionStatus waste={item} hideWrapper={true} />}
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
