import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  HiOutlineFilter,
  HiOutlineLocationMarker,
  HiOutlineScale,
  HiOutlineArrowRight,
} from 'react-icons/hi';

const feedItems = [
  {
    id: 1,
    title: 'Waste Food',
    location: 'Sodepur Ground',
    weight: '15kg',
    urgent: false,
    color: '#8B5E3C',
    emoji: '🥕',
  },
  {
    id: 2,
    title: 'Rotten Crops',
    location: 'Agarpara',
    weight: '150 Kg',
    urgent: true,
    color: '#5C3A1E',
    emoji: '🌿',
  },
  {
    id: 3,
    title: 'Kitchen Scraps',
    location: 'Baranagar',
    weight: '8kg',
    urgent: false,
    color: '#6B4226',
    emoji: '🍌',
  },
  {
    id: 4,
    title: 'Garden Waste',
    location: 'Dunlop',
    weight: '45 Kg',
    urgent: false,
    color: '#3D5E3A',
    emoji: '🌱',
  },
];

export default function DashboardHome() {
  return (
    <div className="flex flex-col gap-6">

      {/* ── Waste List ── */}
      <section>
        <h3 className="text-lg font-bold">Waste Feed</h3>

        <div className="flex flex-col gap-3 mt-3">
          {wasteList.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedWaste(item)}
              className={`p-4 rounded-xl border cursor-pointer ${
                selectedWaste?._id === item._id
                  ? "bg-green-100 border-green-500"
                  : "bg-white"
              }`}
            >
              <h4 className="font-bold">{item.type}</h4>

              <div className="flex gap-3 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <HiOutlineLocationMarker />
                  {item.area}, {item.town}
                </span>

                <span className="flex items-center gap-1">
                  <HiOutlineScale />
                  {item.quantity || "N/A"}
                </span>
              </div>

              <p className="text-xs mt-1">
                Status: <b>{item.status}</b>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Browse Feed (Vertical) ── */}
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
              <button className="px-5 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shrink-0">
                Connect
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Connect Button ── */}
      <button
        onClick={handleConnect}
        className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold"
      >
        Connect Pickup
      </button>

    </div>
  );
}