import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineArrowNarrowLeft, HiOutlineSparkles } from 'react-icons/hi';

export default function ImpactAnalytics() {
  const location = useLocation();
  const navigate = useNavigate();
  // Default to a realistic value if directly navigated without state
  const co2Saved = location.state?.co2Saved || '12.5';
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] animate-fade-in p-6 relative">
      <div className="relative overflow-hidden w-full max-w-lg bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10 text-center z-10">
        {/* Background glow inside card */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl -z-10" />
        
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-primary-500 to-green-400 text-white shadow-xl shadow-primary-500/30 mb-8 animate-bounce" style={{ animationDuration: '3s' }}>
          <HiOutlineSparkles className="w-12 h-12" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-green-500 mb-4 tracking-tight">
          Amazing Job!
        </h1>
        
        <p className="text-gray-500 mb-8 text-base font-medium leading-relaxed px-4">
          You're making a real difference. By recycling your waste today, you have actively helped protect our planet.
        </p>
        
        <div className="bg-gradient-to-br from-primary-50 to-green-50/50 rounded-2xl p-8 border border-primary-100/50 mb-8 relative overflow-hidden group hover:shadow-inner transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
          <p className="text-xs font-bold text-primary-700 mb-3 uppercase tracking-[0.2em]">Estimated Impact</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl font-black text-gray-900 tracking-tighter">{co2Saved}</span>
            <span className="text-xl font-bold text-primary-600">kg</span>
          </div>
          <p className="text-sm text-gray-600 mt-3 font-medium">of CO₂ emissions prevented</p>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl shadow-lg shadow-gray-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all w-full"
        >
          <HiOutlineArrowNarrowLeft className="w-5 h-5 opacity-70" />
          Back to Dashboard
        </button>
      </div>
      
      {/* Decorative floating background elements */}
      <div className="absolute top-1/4 right-[10%] w-64 h-64 bg-green-300/20 rounded-full blur-[80px] -z-0 animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 left-[10%] w-72 h-72 bg-primary-500/10 rounded-full blur-[80px] -z-0 animate-pulse pointer-events-none" style={{ animationDuration: '5s', animationDelay: '1s' }} />
    </div>
  );
}
