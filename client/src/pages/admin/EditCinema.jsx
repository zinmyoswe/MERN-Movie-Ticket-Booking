import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import './AddCinema.css';

const locations = ["Bangkok", "Central", "North", "South", "East"];
const areas = ["Urban", "Nothern", "Eastern", "Thonburi", "Pathumthani", "Nonthaburi"];

const EditCinema = () => {
  const { id } = useParams();
  const { axios, getToken } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCinema = async () => {
      try {
        const { data } = await axios.get(`/api/cinema/${id}`);
        if (data.success) setForm(data.cinema);
      } catch (error) {}
      setLoading(false);
    };
    if (id) fetchCinema();
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.cinemaName || !form.Location) return toast.error('cinemaName and Location are required');
    setSaving(true);
    try {
      const payload = { ...form };
      if (form.Location !== 'Bangkok') payload.Area = null;
      const { data } = await axios.put(`/api/cinema/${id}`, payload, { headers: { Authorization: `Bearer ${await getToken()}` } });
      if (data.success) {
        toast.success('Cinema updated');
        navigate('/admin/list-cinemas');
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
    setSaving(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!form) return <p>Cinema not found</p>;

  return (
    <>
    <div className='addcinema'>
      <Title text1="Edit" text2="Cinema" />
      <div className="max-w-2xl mt-6 space-y-4">
        <input name="cinemaName" value={form.cinemaName} onChange={handleChange} placeholder="Cinema Name *" className="w-full p-2 border rounded" />
        <select name="Location" value={form.Location} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Location *</option>
          {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>
        {form.Location === 'Bangkok' && (
          <select name="Area" value={form.Area || ''} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select Area</option>
            {areas.map(area => <option key={area} value={area}>{area}</option>)}
          </select>
        )}
        <input name="cinemaImage" value={form.cinemaImage || ''} onChange={handleChange} placeholder="Cinema Image URL" className="w-full p-2 border rounded" />
        <textarea name="cinemaInformation" value={form.cinemaInformation || ''} onChange={handleChange} placeholder="Cinema Information" className="w-full p-2 border rounded" />
        <input name="address" value={form.address || ''} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" />
        <input name="officeHours" value={form.officeHours || ''} onChange={handleChange} placeholder="Office Hours (default 9:00 AM - 12:00 PM)" className="w-full p-2 border rounded" />
        <input name="Transport" value={form.Transport || ''} onChange={handleChange} placeholder="Transport (default provided)" className="w-full p-2 border rounded" />
        <input name="map" value={form.map || ''} onChange={handleChange} placeholder="Map URL" className="w-full p-2 border rounded" />
        <button onClick={handleSave} disabled={saving} className="bg-primary text-white px-4 py-2 rounded">{saving ? 'Saving...' : 'Save Cinema'}</button>
      </div>
      </div>
    </>
  );
};

export default EditCinema;
