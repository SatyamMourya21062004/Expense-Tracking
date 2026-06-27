import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/index';
import { ArrowLeft } from 'lucide-react';

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-4xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">{user?.name}</h2>
              <p className="text-sm text-slate-600 mb-6">{user?.email}</p>
              <div className="space-y-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h3>

              {isEditing ? (
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Enter your address"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Full Name</p>
                    <p className="text-lg font-semibold text-slate-900">{formData.name}</p>
                  </div>

                  <div className="pb-6 border-b border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Email Address</p>
                    <p className="text-lg font-semibold text-slate-900">{formData.email}</p>
                  </div>

                  <div className="pb-6 border-b border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Phone Number</p>
                    <p className="text-lg font-semibold text-slate-900">{formData.phone || 'Not provided'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 mb-1">Address</p>
                    <p className="text-lg font-semibold text-slate-900">{formData.address || 'Not provided'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Account Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-600 mb-1">Member Since</p>
                <p className="text-lg font-bold text-slate-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <p className="text-sm text-slate-600 mb-1">Account Status</p>
                <p className="text-lg font-bold text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}