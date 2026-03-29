import React from 'react';
import { HiCheck, HiOutlineChatAlt2, HiOutlineTruck, HiOutlineLocationMarker, HiOutlineScale } from 'react-icons/hi';

export default function ActiveCollectionStatus({ waste, hideWrapper = false, showDetails = false }) {
  if (!waste) return null;

  const currentStatus = waste.status || 'reported';
  
  const step1Done = true; 
  const step2Done = currentStatus === 'assigned' || currentStatus === 'cleared';
  const step3Done = currentStatus === 'cleared';

  const badgeObj = (() => {
    if (currentStatus === 'cleared') return { text: 'Completed', style: 'bg-green-100 text-green-700' };
    if (currentStatus === 'assigned') return { text: 'In Progress', style: 'bg-primary-100 text-primary-700' };
    return { text: 'Reported', style: 'bg-yellow-100 text-yellow-700' };
  })();

  const wasteLabel = waste.type 
    ? (waste.type.charAt(0).toUpperCase() + waste.type.slice(1)) + " Waste" 
    : "Waste Reported";

  const content = (
    <>
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-lg font-extrabold text-gray-900">Active Collection Status</h3>
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${badgeObj.style}`}>
          {badgeObj.text}
        </span>
      </div>

      <div className="relative flex justify-between items-center px-4">
        
        {/* Background Grey Line */}
        <div className="absolute left-[10%] right-[10%] top-[16px] h-[3px] bg-gray-200" />
        
        {/* Active Green Line */}
        <div 
          className="absolute left-[10%] top-[16px] h-[3px] bg-primary-600 transition-all duration-700 ease-in-out" 
          style={{ width: step3Done ? '80%' : (step2Done ? '40%' : '0%') }} 
        />

        {/* Step 1 */}
        <div className="relative flex flex-col items-center gap-3 z-10 w-24">
          <div className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(22,163,74,0.3)] ring-[4px] ring-white">
            <HiCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-900 text-center">{wasteLabel}</span>
        </div>

        {/* Step 2 */}
        <div className="relative flex flex-col items-center gap-3 z-10 w-24">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 ring-[4px] ring-white ${step2Done ? 'bg-primary-600 text-white shadow-[0_4px_12px_rgba(22,163,74,0.3)]' : 'bg-gray-200 text-gray-400'}`}>
            <HiOutlineChatAlt2 className="w-5 h-5" />
          </div>
          <span className={`text-xs font-bold text-center ${step2Done ? 'text-gray-900' : 'text-gray-400'}`}>Contacted</span>
        </div>

        {/* Step 3 */}
        <div className="relative flex flex-col items-center gap-3 z-10 w-24">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 ring-[4px] ring-white ${step3Done ? 'bg-primary-600 text-white shadow-[0_4px_12px_rgba(22,163,74,0.3)]' : 'bg-gray-200 text-gray-400'}`}>
            <HiOutlineTruck className="w-5 h-5" />
          </div>
          <span className={`text-xs font-bold text-center ${step3Done ? 'text-gray-900' : 'text-gray-400'}`}>Completed</span>
        </div>

      </div>

      {showDetails && (
        <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
          {waste.image && (
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100">
               <img src={waste.image} alt={waste.type} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
             <span className="block text-sm font-bold text-gray-900 capitalize">{waste.type} Waste</span>
             <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 mt-1">
               <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                 <HiOutlineLocationMarker className="w-3.5 h-3.5 text-gray-400" />
                 {waste.area ? `${waste.area}, ${waste.town}` : 'Location unknown'}
               </span>
               
               {(waste.quantity || waste.quantity === 0) && (
                   <span className="flex items-center gap-1 text-xs text-gray-500 font-medium sm:border-l sm:border-gray-200 sm:pl-3">
                     <HiOutlineScale className="w-3.5 h-3.5 text-gray-400" />
                     {waste.quantity} KG
                   </span>
               )}
             </div>
          </div>
        </div>
      )}

    </>
  );

  if (hideWrapper) {
    return <div className="py-4">{content}</div>;
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 animate-fade-in">
      {content}
    </div>
  );
}
