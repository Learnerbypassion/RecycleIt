import { useState } from 'react';
import axios from 'axios';
import { HiOutlineDocumentText, HiOutlineLocationMarker, HiOutlineUser } from 'react-icons/hi';

const wasteTypes = [
  { value: 'organic', label: 'Organic (Food, Crop)' },
  { value: 'plastic', label: 'Plastic' },
  { value: 'metal', label: 'Metal' },
  { value: 'glass', label: 'Glass' },
  { value: 'paper', label: 'Paper' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'hazardous', label: 'Hazardous' },
  { value: 'other', label: 'Other' },
];

export default function ReportWaste() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'organic',
    description: '',
    town: '',
    area: '',
    landmark: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await axios.post('/api/waste/add', formData);
      setMessage({ type: 'success', text: 'Waste reported successfully!' });
      setFormData({
        name: '', phone: '', email: '', type: 'organic',
        description: '', town: '', area: '', landmark: ''
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error submitting form. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-3xl mx-auto">
      <div className="mb-2">
        <h2 className="text-2xl font-extrabold text-gray-900">Report Waste</h2>
        <p className="text-sm text-gray-500 mt-1">Submit your waste details for nearby collectors to pick up.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-6">

        {message && (
          <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-primary-50 text-primary-700' : 'bg-red-50 text-red-600'}`}>
            {message.text}
          </div>
        )}

        {/* User Details */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineUser className="w-4 h-4 text-primary-600" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm outline-none" placeholder="Soham" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number *</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm outline-none" placeholder="+91 7524985043" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address (Optional)</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm outline-none" placeholder="abc@gmail.com" />
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100" />

        {/* Waste Details */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineDocumentText className="w-4 h-4 text-primary-600" />
            Waste Details
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Waste Type *</label>
              <select required name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm outline-none appearance-none">
                {wasteTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Waste Quantity (In KGS)</label>
              <input type="number" name="number" value={formData.quantity} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm outline-none" placeholder="10" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description (Optional)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm outline-none resize-none" placeholder="Briefly describe the waste material..." />
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100" />

        {/* Location */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineLocationMarker className="w-4 h-4 text-primary-600" />
            Location Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Town *</label>
              <input required type="text" name="town" value={formData.town} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm outline-none" placeholder="e.g. Sodepur" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Area *</label>
              <input required type="text" name="area" value={formData.area} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm outline-none" placeholder="e.g. Station Road" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Landmark (Optional)</label>
              <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm outline-none" placeholder="Near GNIT College..." />
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Google Map Link</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm outline-none" placeholder="Map Link" />
            </div>

        <div className="mt-4">
          <button disabled={loading} type="submit" className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl shadow-[0_4px_12px_rgba(22,163,74,0.25)] hover:shadow-[0_6px_16px_rgba(22,163,74,0.35)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none">
            {loading ? 'Submitting...' : 'Submit Waste Report'}
          </button>
        </div>

      </form>
    </div>
  );
}
