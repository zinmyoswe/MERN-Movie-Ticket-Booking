import React, { useState } from 'react';
import Title from '../../components/admin/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import './AdminZin.css'; 

const AddPromotion = () => {
  const { axios, getToken } = useAppContext();
  const navigate = useNavigate();

  const [promotionImage, setPromotionImage] = useState('');
  const [promotionName, setPromotionName] = useState('');
  const [promotionPhrase, setPromotionPhrase] = useState('');
  const [quota, setQuota] = useState('');
  const [promotionDescription, setPromotionDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!promotionImage || !promotionName)
      return toast.error('Promotion Image and Name are required');

    try {
      setLoading(true);

      const payload = {
        PromotionImage: promotionImage,
        PromotionName: promotionName,
        PromotionPhrase: promotionPhrase || null,
        Quota: quota || null,
        PromotionDescription: promotionDescription || null,
      };

      const { data } = await axios.post('/api/promotion', payload, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success('Promotion added successfully');
        navigate('/admin/list-promotions');
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error');
    }

    setLoading(false);
  };

  return (
    // Updated container: lighter background, better padding
    <div className="admin-container adminzin bg-gray-50 min-h-screen p-8">
      <Title text1="Create" text2="New Promotion" />
      
      {/* Promotion Image Preview Section */}
      <div className="promotion-preview-section mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Image Preview</h3>
        <div className="w-full h-56 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center border border-dashed border-gray-400">
          {promotionImage ? (
            // Basic image tag to show the preview
            <img 
              src={promotionImage} 
              alt="Promotion Preview" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src="https://via.placeholder.com/600x200?text=Invalid+Image+URL"
              }}
            />
          ) : (
            <span className="text-gray-500">Enter a URL to see the preview</span>
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
              value={promotionImage}
              onChange={(e) => setPromotionImage(e.target.value)}
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
              value={promotionName}
              onChange={(e) => setPromotionName(e.target.value)}
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
              value={promotionPhrase}
              onChange={(e) => setPromotionPhrase(e.target.value)}
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
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
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
            value={promotionDescription}
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
            onEditorChange={(content) => setPromotionDescription(content)}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={loading}
            // Modern, colorful primary button style
            className="btn-primary flex items-center justify-center space-x-2 
                       px-6 py-3 bg-primary text-white font-semibold rounded-lg 
                       shadow-md hover:bg-zinmyo-200 transition duration-300 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Adding...</span>
                </>
            ) : (
                <>
                    <span>Add Promotion</span>
                </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddPromotion;