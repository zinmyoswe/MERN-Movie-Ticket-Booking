import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import './AdminZin.css'; 

const EditPromotion = () => {
  const { axios, getToken } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    PromotionImage: '',
    PromotionName: '',
    PromotionPhrase: '',
    Quota: '',
    PromotionDescription: '',
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPromotion = async () => {
    try {
      const { data } = await axios.get(`/api/promotion/${id}`);
      if (data.success) {
        // Ensure null/undefined values are converted to empty strings for controlled inputs
        setForm({
            PromotionImage: data.promotion.PromotionImage || '',
            PromotionName: data.promotion.PromotionName || '',
            PromotionPhrase: data.promotion.PromotionPhrase || '',
            Quota: data.promotion.Quota || '',
            PromotionDescription: data.promotion.PromotionDescription || '',
        });
      }
    } catch (error) {
      toast.error('Failed to load promotion data.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPromotion();
  }, [id]); // Depend on 'id' to re-fetch if the URL parameter changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.PromotionImage || !form.PromotionName)
      return toast.error('Promotion Image and Name are required');
      
    setIsSubmitting(true);
    try {
      // Clean up fields to send null if empty string, matching the backend payload structure from AddPromotion
      const payload = {
        PromotionImage: form.PromotionImage,
        PromotionName: form.PromotionName,
        PromotionPhrase: form.PromotionPhrase || null,
        Quota: form.Quota || null,
        PromotionDescription: form.PromotionDescription || null,
      };

      const { data } = await axios.put(`/api/promotion/${id}`, payload, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success('Promotion updated successfully!');
        navigate('/admin/list-promotions');
      } else {
        toast.error(data.message || 'Update failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error: Update failed.');
    }
    setIsSubmitting(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <p className="text-xl text-indigo-600">Loading Promotion details...</p>
    </div>
  );

  return (
    <div className="admin-container adminzin bg-gray-50 min-h-screen p-8">
      <Title text1="Edit" text2="Promotion" />

      {/* Promotion Image Preview Section */}
      <div className="promotion-preview-section mb-6 mt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Image Preview</h3>
        <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center border border-dashed border-gray-400">
          {form.PromotionImage ? (
            <img 
              src={form.PromotionImage} 
              alt="Promotion Preview" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src="https://via.placeholder.com/600x200?text=Invalid+Image+URL"
              }}
            />
          ) : (
            <span className="text-gray-500">No image URL provided</span>
          )}
        </div>
      </div>
      
      {/* Form Container: Card-like design with shadow */}
      <div className="form-card max-w-4xl bg-white rounded-xl shadow-lg p-8 space-y-6">

        {/* --- Grid Layout for basic fields --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Promotion Image URL */}
          <div className="form-group">
            <label className="form-label font-medium text-gray-700 block mb-2">
              Promotion Image URL <span className="text-red-500">*</span>
            </label>
            <input
              name="PromotionImage"
              value={form.PromotionImage}
              onChange={handleChange}
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              placeholder="e.g., https://example.com/promo-banner.jpg"
            />
          </div>

          {/* Promotion Name */}
          <div className="form-group">
            <label className="form-label font-medium text-gray-700 block mb-2">
               Promotion Name <span className="text-red-500">*</span>
            </label>
            <input
              name="PromotionName"
              value={form.PromotionName}
              onChange={handleChange}
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              placeholder="e.g., Summer Sale Extravaganza"
            />
          </div>

          {/* Promotion Phrase */}
          <div className="form-group">
            <label className="form-label font-medium text-gray-700 block mb-2">
               Short Phrase
            </label>
            <input
              name="PromotionPhrase"
              value={form.PromotionPhrase}
              onChange={handleChange}
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              placeholder="e.g., Get 50% off everything!"
            />
          </div>

          {/* Quota */}
          <div className="form-group">
            <label className="form-label font-medium text-gray-700 block mb-2">
               Quota / Limitation
            </label>
            <input
              name="Quota"
              value={form.Quota}
              onChange={handleChange}
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              placeholder="e.g., Limited to first 100 customers"
            />
          </div>
        </div>
        {/* --- End Grid Layout --- */}

        {/* Promotion Description (Full Width) */}
        <div className="form-group">
          <label className="form-label font-medium text-gray-700 block mb-2">
             Promotion Description (Detailed)
          </label>
          <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
            value={form.PromotionDescription}
            init={{
              height: 400, // Increased height for better editing
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
            onEditorChange={(content) =>
              setForm({ ...form, PromotionDescription: content })
            }
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary flex items-center justify-center space-x-2 
                       px-6 py-3 bg-primary text-white font-semibold rounded-lg 
                       shadow-md hover:bg-zinmyo-200 transition duration-300 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                </>
            ) : (
                <>
                    <span> Update Promotion</span>
                </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditPromotion;