import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Car,
  Bike,
  Truck,
  HeartPulse,
  Users,
  Eye,
  Download,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  X,
  AlertCircle,
} from 'lucide-react';

const CATEGORY_ICONS = {
  car: Car,
  bike: Bike,
  commercial: Truck,
  health: HeartPulse,
  life: Users,
};

const STATUS_COLORS = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-300',
  'Under Review': 'bg-blue-100 text-blue-800 border-blue-300',
  Contacted: 'bg-purple-100 text-purple-800 border-purple-300',
  Completed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Rejected: 'bg-red-100 text-red-800 border-red-300',
};

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, contacted: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Fetch enquiries from API
  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedStatus !== 'all') params.set('status', selectedStatus);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/enquiries/list?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setEnquiries(data.enquiries || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEnquiries();
  };

  // Update enquiry status
  const handleStatusChange = async (applicationId, newStatus) => {
    setStatusUpdateLoading(true);
    try {
      const res = await fetch('/api/enquiries/list', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.applicationId === applicationId ? data.enquiry : e))
        );
        if (selectedEnquiry && selectedEnquiry.applicationId === applicationId) {
          setSelectedEnquiry(data.enquiry);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!enquiries.length) return;
    const headers = ['Application ID', 'Category', 'Customer Name', 'Mobile', 'Email', 'City', 'Status', 'Date'];
    const rows = enquiries.map((e) => [
      e.applicationId,
      e.categoryLabel,
      e.customer.name,
      e.customer.mobile,
      e.customer.email,
      e.customer.city,
      e.status,
      new Date(e.createdAt).toLocaleString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map((r) => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bip-enquiries-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-10 sm:py-12">
      <div className="wrap">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF2DE] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#101C38] border border-[#E5B544]/60 mb-2">
              <ShieldCheck size={13} className="text-[#F51F2B]" />
              <span>Admin Management Portal</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-[#101C38] tracking-tight">
              Insurance Applications & Enquiries
            </h1>
            <p className="text-xs sm:text-sm text-[#53627A] mt-0.5">
              Review, contact, and manage customer applications and insurance enquiries.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchEnquiries}
              className="btn-outline !py-2 !px-3.5 text-xs font-bold flex items-center gap-1.5"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleExportCSV}
              disabled={!enquiries.length}
              className="btn-gold !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-5 border border-[#E5E7EB] bg-white shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Applications</span>
            <div className="flex items-baseline justify-between mt-2">
              <b className="font-display text-2xl sm:text-3xl font-black text-[#101C38]">
                {stats.total || enquiries.length}
              </b>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Direct Submission
              </span>
            </div>
          </div>

          <div className="card p-5 border border-[#E5E7EB] bg-white shadow-xs">
            <span className="text-xs font-bold text-amber-700 uppercase">Pending Review</span>
            <div className="flex items-baseline justify-between mt-2">
              <b className="font-display text-2xl sm:text-3xl font-black text-amber-700">
                {stats.pending || 0}
              </b>
              <span className="text-xs text-slate-500">Requires follow-up</span>
            </div>
          </div>

          <div className="card p-5 border border-[#E5E7EB] bg-white shadow-xs">
            <span className="text-xs font-bold text-purple-700 uppercase">Contacted</span>
            <div className="flex items-baseline justify-between mt-2">
              <b className="font-display text-2xl sm:text-3xl font-black text-purple-700">
                {stats.contacted || 0}
              </b>
              <span className="text-xs text-slate-500">Quotes shared</span>
            </div>
          </div>

          <div className="card p-5 border border-[#E5E7EB] bg-white shadow-xs">
            <span className="text-xs font-bold text-emerald-700 uppercase">Policies Issued</span>
            <div className="flex items-baseline justify-between mt-2">
              <b className="font-display text-2xl sm:text-3xl font-black text-emerald-700">
                {stats.completed || 0}
              </b>
              <span className="text-xs text-slate-500">Completed</span>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="card p-4 sm:p-5 border border-[#E5E7EB] bg-white shadow-xs mb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                ['all', 'All Categories'],
                ['car', 'Car'],
                ['bike', 'Bike'],
                ['commercial', 'Commercial'],
                ['health-life', 'Health + Life'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === key
                      ? 'bg-[#101C38] text-white shadow-xs'
                      : 'bg-[#F3F4F6] text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="inp !py-1.5 !px-3 !text-xs bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="under review">Under Review</option>
                <option value="contacted">Contacted</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Application ID, Customer Name, Mobile (+91...), or Reg No..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="inp pl-10 text-xs py-2 w-full"
              />
            </div>
            <button type="submit" className="btn-gold !py-2 !px-4 text-xs font-bold shrink-0">
              Search
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                }}
                className="btn-outline !py-2 !px-3 text-xs"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Applications List Table */}
        <div className="card border border-[#E5E7EB] bg-white shadow-card overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-slate-500">
              <RefreshCw size={24} className="animate-spin mx-auto text-[#E5B544] mb-2" />
              <p className="text-xs font-bold">Loading applications...</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <AlertCircle size={28} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-bold text-[#101C38]">No applications found</p>
              <p className="text-xs text-slate-500 mt-1">Try clearing filters or search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#FAF2DE]/30 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Application ID</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Key Specifications</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {enquiries.map((e) => {
                    const CatIcon = CATEGORY_ICONS[e.category] || Car;
                    return (
                      <tr key={e.applicationId} className="hover:bg-[#FAF2DE]/10 transition-colors">
                        <td className="py-3.5 px-4">
                          <b className="font-display font-bold text-[#101C38] block tracking-wide">
                            {e.applicationId}
                          </b>
                          <span className="text-[10.5px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                            <CheckCircle2 size={11} />
                            <span>Submitted</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF2DE] text-[#101C38] font-bold text-[11.5px] border border-[#E5B544]/50">
                            <CatIcon size={13} className="text-[#F51F2B]" />
                            <span>{e.categoryLabel}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <b className="text-[#101C38] block text-[12.5px]">{e.customer.name}</b>
                          <div className="text-slate-500 text-[11px] space-y-0.5 mt-0.5">
                            <div className="flex items-center gap-1">
                              <Phone size={10} className="text-[#E5B544]" />
                              <span>+91 {e.customer.mobile}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-400">
                              <MapPin size={10} />
                              <span>{e.customer.city}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                          {e.details.regNumber && (
                            <span className="block font-bold text-[#101C38] uppercase">
                              {e.details.regNumber}
                            </span>
                          )}
                          {e.details.model && (
                            <span className="block text-[11.5px]">
                              {e.details.manufacturer} {e.details.model} ({e.details.mfgYear || ''})
                            </span>
                          )}
                          {e.details.sumInsured && (
                            <span className="block font-bold text-[#101C38]">
                              Sum Insured: {e.details.sumInsured}
                            </span>
                          )}
                          {e.details.sumAssured && (
                            <span className="block font-bold text-[#101C38]">
                              Life Cover: {e.details.sumAssured}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={e.status}
                            onChange={(ev) => handleStatusChange(e.applicationId, ev.target.value)}
                            disabled={statusUpdateLoading}
                            className={`border rounded-lg px-2.5 py-1 text-[11px] font-bold outline-none cursor-pointer ${
                              STATUS_COLORS[e.status] || 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Completed">Completed</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {new Date(e.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                          <span className="block text-[10px] text-slate-400">
                            {new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedEnquiry(e)}
                            className="btn-outline !py-1 !px-2.5 text-xs font-bold inline-flex items-center gap-1"
                          >
                            <Eye size={12} />
                            <span>Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Detailed Application View */}
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in backdrop-blur-xs">
            <div className="card w-full max-w-2xl bg-white border border-[#E5E7EB] p-6 shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-[#E5E7EB] pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F51F2B]">
                    Application Details
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#101C38] mt-0.5">
                    {selectedEnquiry.applicationId}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Category: <b>{selectedEnquiry.categoryLabel}</b> • Submitted on{' '}
                    {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Customer Contact Details */}
              <div className="mt-4 rounded-2xl bg-[#FAF2DE]/30 border border-[#E5B544]/40 p-4">
                <b className="text-xs font-bold text-[#101C38] uppercase tracking-wider block mb-2">
                  Applicant Information
                </b>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Name:</span>
                    <b className="text-[#101C38] text-sm">{selectedEnquiry.customer.name}</b>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Mobile:</span>
                    <a
                      href={`tel:${selectedEnquiry.customer.mobile}`}
                      className="font-bold text-[#F51F2B] hover:underline flex items-center gap-1"
                    >
                      <Phone size={12} />
                      <span>+91 {selectedEnquiry.customer.mobile}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Email:</span>
                    <a
                      href={`mailto:${selectedEnquiry.customer.email}`}
                      className="text-slate-700 hover:underline flex items-center gap-1"
                    >
                      <Mail size={12} />
                      <span>{selectedEnquiry.customer.email}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 block">City / RTO:</span>
                    <b className="text-[#101C38]">{selectedEnquiry.customer.city}</b>
                  </div>
                </div>
              </div>

              {/* Category-Specific Form Information */}
              <div className="mt-4 space-y-2">
                <b className="text-xs font-bold text-[#101C38] uppercase tracking-wider block">
                  Application Specifications
                </b>
                <div className="rounded-2xl border border-[#E5E7EB] bg-slate-50/50 p-4">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                    {Object.entries(selectedEnquiry.details || {}).map(([key, val]) => (
                      <div key={key}>
                        <dt className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</dt>
                        <dd className="font-bold text-[#101C38]">{val || '—'}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {/* Status Update & Actions */}
              <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Update Status:</span>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(ev) => handleStatusChange(selectedEnquiry.applicationId, ev.target.value)}
                    className="inp !py-1.5 !px-3 text-xs bg-white font-bold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedEnquiry.customer.mobile}`}
                    className="btn-gold !py-1.5 !px-3.5 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Phone size={13} />
                    <span>Call Customer</span>
                  </a>
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="btn-outline !py-1.5 !px-3.5 text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
