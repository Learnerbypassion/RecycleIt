import {
  HiOutlineFilter,
  HiOutlineLocationMarker,
  HiOutlineScale,
} from "react-icons/hi";

import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardHome() {
  const [wasteList, setWasteList] = useState([]);
  const [collectors, setCollectors] = useState([]);

  const [selectedWaste, setSelectedWaste] = useState(null);
  const [selectedCollector, setSelectedCollector] = useState(null);

  useEffect(() => {
    fetchWaste();
    fetchCollectors();
  }, []);

  // 🔥 Fetch waste
  const fetchWaste = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/waste/all");
      setWasteList(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Fetch collectors
  const fetchCollectors = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/collector");
      setCollectors(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Create pickup
  const handleConnect = async () => {
    if (!selectedWaste || !selectedCollector) {
      alert("Select waste AND collector");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/pickup/create", {
        collectorId: selectedCollector._id,
        wasteId: selectedWaste._id,
      });

      alert("Pickup assigned");

      fetchWaste(); // refresh
      setSelectedWaste(null);
      setSelectedCollector(null);

    } catch (err) {
      console.error(err);
      alert("Error creating pickup");
    }
  };

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

      {/* ── Collectors ── */}
      <section>
        <h3 className="text-lg font-bold">Collectors</h3>

        <div className="flex flex-col gap-3 mt-3">
          {collectors.map((c) => (
            <div
              key={c._id}
              onClick={() => setSelectedCollector(c)}
              className={`p-4 rounded-xl border cursor-pointer ${
                selectedCollector?._id === c._id
                  ? "bg-blue-100 border-blue-500"
                  : "bg-white"
              }`}
            >
              <h4 className="font-bold">{c.name}</h4>

              <p className="text-sm text-gray-500">
                {c.location.area}, {c.location.town}
              </p>

              <p className="text-xs mt-1">
                Accepts: {c.acceptedTypes.join(", ")}
              </p>
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