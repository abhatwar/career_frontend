import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const TABS = ['Dashboard', 'Users', 'Payments', 'Content'];

const EMPTY_CONTENT_FORM = {
  title: '',
  description: '',
  body: '',
  content_type: 'text',
  price: 1100,
  is_active: true,
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [contentList, setContentList] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_CONTENT_FORM);
  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // ── Data fetchers ───────────────────────────────────────────
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.stats);
    } catch {
      setError('Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/payments');
      setPayments(res.data.payments);
    } catch {
      setError('Failed to load payments.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/content');
      setContentList(res.data.content);
    } catch {
      setError('Failed to load content.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (activeTab === 'Users') fetchUsers();
    if (activeTab === 'Payments') fetchPayments();
    if (activeTab === 'Content') fetchContent();
  }, [activeTab, fetchUsers, fetchPayments, fetchContent]);

  // ── Content form ────────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_CONTENT_FORM);
    setPdfFile(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title,
      description: item.description || '',
      body: item.body || '',
      content_type: item.content_type,
      price: item.price,
      is_active: item.is_active,
    });
    setPdfFile(null);
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      let payload = { ...form };

      if (form.content_type === 'pdf' && pdfFile) {
        // Step 1: Get a signed upload signature from backend
        const sigRes = await api.get('/admin/upload-signature');
        const { signature, timestamp, cloudName, apiKey, folder } = sigRes.data;

        // Step 2: Upload PDF directly to Cloudinary (bypasses Vercel 4.5MB limit)
        const cloudinaryForm = new FormData();
        cloudinaryForm.append('file', pdfFile);
        cloudinaryForm.append('signature', signature);
        cloudinaryForm.append('timestamp', String(timestamp));
        cloudinaryForm.append('api_key', apiKey);
        cloudinaryForm.append('folder', folder);
        // Note: resource_type is in the URL (/raw/upload), NOT in the form body

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
          { method: 'POST', body: cloudinaryForm }
        );
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error?.message || 'Cloudinary upload failed.');

        // Step 3: Include the Cloudinary URL in the content payload (no file in body)
        payload.pdf_url = uploadData.secure_url;
      }

      if (editingId) {
        await api.put(`/admin/content/${editingId}`, payload);
      } else {
        await api.post('/admin/content', payload);
      }
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_CONTENT_FORM);
      setPdfFile(null);
      fetchContent();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save content.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteContent = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This also removes the PDF from Cloudinary and cannot be undone.`)) return;
    try {
      await api.delete(`/admin/content/${id}`);
      fetchContent();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete content.');
    }
  };

  // ── Stat cards data ─────────────────────────────────────────
  const statCards = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers, icon: '◉' },
        { label: 'Paid Orders', value: stats.totalPayments, icon: '◈' },
        {
          label: 'Revenue (₹)',
          value: `₹${Number(stats.totalRevenue || 0).toFixed(2)}`,
          icon: '◆',
        },
        { label: 'Active Content', value: stats.totalContent, icon: '◇' },
      ]
    : [];

  return (
    <div className="min-h-screen pt-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage users, payments, and premium content
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm mb-6"
          >
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-dark-2 border border-border rounded-xl p-1 w-fit flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner fullScreen={false} />
        ) : (
          <>
            {/* ── Dashboard Tab ─────────────────────────────── */}
            {activeTab === 'Dashboard' && stats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                  <div key={i} className="card">
                    <span className="text-2xl text-gray-600">{card.icon}</span>
                    <div className="text-2xl font-bold mt-3">{card.value}</div>
                    <div className="text-gray-500 text-sm mt-1">{card.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Users Tab ────────────────────────────────── */}
            {activeTab === 'Users' && (
              <div className="card overflow-x-auto">
                <p className="text-gray-500 text-sm mb-4">
                  {users.length} user(s) total
                </p>
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="text-gray-500 border-b border-border text-left">
                      <th className="pb-3 pr-4 font-medium">Name</th>
                      <th className="pb-3 pr-4 font-medium">Email</th>
                      <th className="pb-3 pr-4 font-medium">Role</th>
                      <th className="pb-3 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((u) => (
                      <tr key={u._id} className="text-gray-300">
                        <td className="py-3 pr-4">{u.name}</td>
                        <td className="py-3 pr-4 text-gray-400">{u.email}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              u.role === 'admin'
                                ? 'bg-white text-black'
                                : 'bg-white/10 text-gray-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-12 text-center text-gray-600"
                        >
                          No users yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Payments Tab ─────────────────────────────── */}
            {activeTab === 'Payments' && (
              <div className="card overflow-x-auto">
                <p className="text-gray-500 text-sm mb-4">
                  {payments.length} payment(s) total
                </p>
                <table className="w-full text-sm min-w-[620px]">
                  <thead>
                    <tr className="text-gray-500 border-b border-border text-left">
                      <th className="pb-3 pr-4 font-medium">User</th>
                      <th className="pb-3 pr-4 font-medium">Content</th>
                      <th className="pb-3 pr-4 font-medium">Amount</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payments.map((p) => (
                      <tr key={p._id} className="text-gray-300">
                        <td className="py-3 pr-4">
                          <div>{p.user_id?.name}</div>
                          <div className="text-gray-600 text-xs">{p.user_id?.email}</div>
                        </td>
                        <td className="py-3 pr-4">{p.content_id?.title}</td>
                        <td className="py-3 pr-4">₹{(p.amount / 100).toFixed(2)}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              p.status === 'paid'
                                ? 'bg-green-500/15 text-green-400'
                                : p.status === 'failed'
                                ? 'bg-red-500/15 text-red-400'
                                : 'bg-yellow-500/15 text-yellow-400'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-12 text-center text-gray-600"
                        >
                          No payments yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Content Tab ──────────────────────────────── */}
            {activeTab === 'Content' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-sm">
                    {contentList.length} item(s)
                  </p>
                  <button
                    onClick={showForm ? () => setShowForm(false) : openCreate}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    {showForm ? 'Cancel' : '+ Add Content'}
                  </button>
                </div>

                {/* Content form */}
                {showForm && (
                  <form
                    onSubmit={handleFormSubmit}
                    className="card space-y-4 animate-slide-down"
                  >
                    <h3 className="font-semibold">
                      {editingId ? 'Edit Content' : 'New Content'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1.5">
                          Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={form.title}
                          onChange={handleFormChange}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1.5">
                          Type *
                        </label>
                        <select
                          name="content_type"
                          value={form.content_type}
                          onChange={handleFormChange}
                          className="input-field"
                        >
                          {['text', 'video', 'pdf', 'mixed'].map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">
                        Short Description
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleFormChange}
                        placeholder="Displayed on the landing page"
                        className="input-field"
                      />
                    </div>

                    {form.content_type === 'pdf' ? (
                      <div>
                        <label className="block text-sm text-gray-400 mb-1.5">
                          PDF File {!editingId && '*'}
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => setPdfFile(e.target.files[0] || null)}
                          className="input-field text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-white/10 file:text-gray-300 file:text-xs"
                          required={!editingId}
                        />
                        {editingId && (
                          <p className="text-xs text-gray-600 mt-1">
                            Leave empty to keep existing PDF.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm text-gray-400 mb-1.5">
                          Content Body * (HTML supported)
                        </label>
                        <textarea
                          name="body"
                          value={form.body}
                          onChange={handleFormChange}
                          rows={10}
                          className="input-field resize-y font-mono text-sm"
                          placeholder="<h2>Chapter 1</h2><p>Your content here...</p>"
                          required
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1.5">
                          Price (paise) — 1100 = ₹11
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={form.price}
                          onChange={handleFormChange}
                          min="100"
                          className="input-field"
                        />
                      </div>
                      {editingId && (
                        <div className="flex items-end pb-1">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="is_active"
                              checked={form.is_active}
                              onChange={handleFormChange}
                              className="w-4 h-4 rounded"
                            />
                            <span className="text-sm text-gray-400">Active</span>
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary px-6 py-2.5 text-sm"
                      >
                        {submitting
                          ? 'Saving...'
                          : editingId
                          ? 'Update Content'
                          : 'Create Content'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="btn-secondary px-6 py-2.5 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Content list */}
                <div className="space-y-3">
                  {contentList.map((item) => (
                    <div
                      key={item._id}
                      className="card flex items-start justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-medium truncate">{item.title}</h3>
                          <span
                            className={`px-2 py-0.5 rounded text-xs flex-shrink-0 ${
                              item.is_active
                                ? 'bg-green-500/15 text-green-400'
                                : 'bg-red-500/15 text-red-400'
                            }`}
                          >
                            {item.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-gray-500 text-sm truncate">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                          <span className="uppercase">{item.content_type}</span>
                          <span>₹{(item.price / 100).toFixed(2)}</span>
                          <span>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => openEdit(item)}
                        className="btn-secondary px-3 py-1.5 text-xs flex-shrink-0"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteContent(item._id, item.title)}
                        className="px-3 py-1.5 text-xs flex-shrink-0 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}

                  {contentList.length === 0 && !showForm && (
                    <div className="card text-center py-14 text-gray-600">
                      No content yet.{' '}
                      <button
                        onClick={openCreate}
                        className="text-white hover:underline"
                      >
                        Add your first item.
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
