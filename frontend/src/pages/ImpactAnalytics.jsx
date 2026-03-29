import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiOutlineArrowNarrowLeft, HiOutlineSparkles, HiOutlineScale, HiOutlineDocumentText, HiOutlineCheckCircle } from 'react-icons/hi';

const CO2_PER_KG = {
  plastic: 2.5,
  organic: 0.8,
  metal: 4.0,
  glass: 1.2,
  electronic: 5.0,
  hazardous: 3.5,
  paper: 1.5,
};

function getCo2Factor(type) {
  const t = (type || '').toLowerCase();
  return CO2_PER_KG[t] || 2.0;
}

export default function ImpactAnalytics() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  const [stats, setStats] = useState({
    totalSubmissions: 0,
    totalKg: 0,
    co2Saved: 0,
    pickedUp: 0,
  });
  const [aiMessage, setAiMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }
    axios.get(`/api/waste/user/${userEmail}`)
      .then(async res => {
        const wastes = res.data?.data || [];
        let totalKg = 0;
        let co2Saved = 0;
        let pickedUp = 0;

        wastes.forEach(w => {
          const kg = parseFloat(w.quantity) || 0;
          totalKg += kg;
          co2Saved += kg * getCo2Factor(w.type);
          if (w.status === 'cleared') pickedUp++;
        });

        setStats({
          totalSubmissions: wastes.length,
          totalKg: totalKg.toFixed(1),
          co2Saved: co2Saved.toFixed(1),
          pickedUp,
        });

        if (wastes.length > 0) {
          const latest = wastes[0];
          const latestKg = parseFloat(latest.quantity) || 1;
          const fallbackCo2 = (latestKg * 2.5).toFixed(1);
          const fallbackMsg = `Great job! By recycling your ${latest.type || 'waste'}, you saved approximately ${fallbackCo2} kg of CO2. Thank you for making a difference!`;
          try {
            const aiRes = await axios.post('/api/ai/generate', {
              weight: latestKg,
              type: latest.type
            });
            setAiMessage(aiRes.data.co2Saved || fallbackMsg);
          } catch (err) {
            setAiMessage(fallbackMsg);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userEmail]);

  const statCards = [
    {
      icon: <HiOutlineDocumentText className="w-6 h-6" />,
      value: stats.totalSubmissions,
      label: 'Total Reports',
      color: 'from-blue-500 to-blue-400',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
    },
    {
      icon: <HiOutlineScale className="w-6 h-6" />,
      value: `${stats.totalKg} kg`,
      label: 'Total Waste Submitted',
      color: 'from-amber-500 to-amber-400',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
    },
    {
      icon: <HiOutlineCheckCircle className="w-6 h-6" />,
      value: stats.pickedUp,
      label: 'Successfully Picked Up',
      color: 'from-primary-500 to-green-400',
      bg: 'bg-primary-50',
      text: 'text-primary-700',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] animate-fade-in p-6 relative">
      <div className="relative overflow-hidden w-full max-w-lg bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 text-center z-10">
        {/* Background glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl -z-10" />

        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-primary-500 to-green-400 text-white shadow-xl shadow-primary-500/30 mb-6 animate-bounce" style={{ animationDuration: '3s' }}>
          <HiOutlineSparkles className="w-10 h-10" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-green-500 mb-2 tracking-tight">
          Your Impact
        </h1>
        <p className="text-gray-400 text-sm font-medium mb-8">
          {userEmail ? `Showing cumulative impact for ${userEmail}` : 'Track your environmental contribution'}
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="flex flex-col gap-3 mb-6">
              {statCards.map((card, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-2xl ${card.bg} border border-white/60 text-left`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shrink-0 shadow-md`}>
                    {card.icon}
                  </div>
                  <div>
                    <p className={`text-xl font-black ${card.text}`}>{card.value}</p>
                    <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CO2 hero section */}
            <div className="bg-gradient-to-br from-primary-50 to-green-50/50 rounded-2xl p-6 border border-primary-100/50 mb-6 relative overflow-hidden group hover:shadow-inner transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              <p className="text-xs font-bold text-primary-700 mb-2 uppercase tracking-[0.2em]">Total CO₂ Emissions Prevented</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-black text-gray-900 tracking-tighter">{stats.co2Saved}</span>
                <span className="text-lg font-bold text-primary-600">kg</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 font-medium">
                Based on all your waste submissions
              </p>
            </div>

            {aiMessage && (
              <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm text-left animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                    <HiOutlineSparkles className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">
                    {aiMessage}
                  </p>
                </div>
              </div>
            )}

            {!userEmail && (
              <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 mb-4">
                Submit waste with your email to track your personal impact!
              </p>
            )}
          </>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl shadow-lg shadow-gray-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all w-full"
        >
          <HiOutlineArrowNarrowLeft className="w-5 h-5 opacity-70" />
          Back to Dashboard
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-[10%] w-64 h-64 bg-green-300/20 rounded-full blur-[80px] -z-0 animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 left-[10%] w-72 h-72 bg-primary-500/10 rounded-full blur-[80px] -z-0 animate-pulse pointer-events-none" style={{ animationDuration: '5s', animationDelay: '1s' }} />
    </div>
  );
}
