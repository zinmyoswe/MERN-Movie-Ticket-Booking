import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Title from '../../components/admin/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './AddCinema.css';

const locations = ["Bangkok", "Central", "North", "South", "East"];
const areas = ["Urban", "Nothern", "Eastern", "Thonburi", "Pathumthani", "Nonthaburi"];

const AddCinema = () => {
  const { axios, getToken } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cinemaImage: '',
    cinemaName: '',
    Location: '',
    Area: '',
    cinemaInformation: '',
    address: '',
    officeHours: '',
    Transport: '',
    map: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.cinemaName || !form.Location) return toast.error('cinemaName and Location are required');
    setLoading(true);
    try {
      const payload = { ...form };
      if (form.Location !== 'Bangkok') payload.Area = null;
      const { data } = await axios.post('/api/cinema', payload, { headers: { Authorization: `Bearer ${await getToken()}` } });
      if (data.success) {
        toast.success('Cinema added');
        navigate('/admin/list-cinemas');
      } else {
        toast.error(data.message || 'Failed to add cinema');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
    setLoading(false);
  };

  return (
    <>
    <div className='addcinema'>
      <Title text1="Add" text2="Cinema" />
      <div className="max-w-2xl mt-6 space-y-4 text-dark">
        <input name="cinemaName" value={form.cinemaName} onChange={handleChange} placeholder="Cinema Name *" className="w-full p-2 border rounded" />
        <select name="Location" value={form.Location} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Location *</option>
          {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>
        {form.Location === 'Bangkok' && (
          <select name="Area" value={form.Area} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select Area</option>
            {areas.map(area => <option key={area} value={area}>{area}</option>)}
          </select>
        )}
        <input name="cinemaImage" value={form.cinemaImage} onChange={handleChange} placeholder="Cinema Image URL" className="w-full p-2 border rounded" />
        <div>
          <label className="text-sm font-medium mb-1 block">Cinema Information</label>
          <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY || ''}
            value={form.cinemaInformation}
            init={{
              height: 300,
              menubar: false,
              plugins: ['link', 'lists', 'code'],
              toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link | code'
            }}
            onEditorChange={(content) => setForm({ ...form, cinemaInformation: content })}
          />
        </div>
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" />
        <input name="officeHours" value={form.officeHours} onChange={handleChange} placeholder="Office Hours (default 9:00 AM - 12:00 PM)" className="w-full p-2 border rounded" />
        <input name="Transport" value={form.Transport} onChange={handleChange} placeholder="Transport (default provided)" className="w-full p-2 border rounded" />
        <input name="map" value={form.map} onChange={handleChange} placeholder="Map URL" className="w-full p-2 border rounded" />
        <button onClick={handleSubmit} disabled={loading} className="bg-primary text-white px-4 py-2 rounded cursor-pointer">{loading ? 'Adding...' : 'Add Cinema'}</button>
      </div>
      </div>
    </>
  );
};

export default AddCinema;
