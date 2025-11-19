import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Title from '../../components/admin/Title';

// Helper function to truncate text
const truncateText = (text, wordLimit) => {
  if (!text) return '';
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = text;
  const cleanText = tempDiv.textContent || tempDiv.innerText || "";
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  if (words.length <= wordLimit) return cleanText;
  return words.slice(0, wordLimit).join(' ') + '...';
};

const ListPromotion = () => {
  const { axios, getToken } = useAppContext();
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalPromotionId, setModalPromotionId] = useState(null); // 🔹 Track promotion to delete

  const fetchPromotions = async () => {
    try {
      const { data } = await axios.get('/api/promotion');
      if (data.success) setPromotions(data.promotions);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load promotions');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/promotion/${id}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      toast.success('Promotion deleted successfully!');
      setModalPromotionId(null); // Close modal
      fetchPromotions();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete promotion');
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <p className="text-xl text-indigo-600">Loading Promotions...</p>
    </div>
  );

  return (
    <div className="admin-container bg-gray-50 min-h-screen p-8">
      <Title text1="Manage" text2="Promotions" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-extrabold text-gray-800">
          Total Promotions: <span className="text-primary">{promotions.length}</span>
        </h2>
        <button
          onClick={() => navigate('/admin/add-promotion')}
          className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-zinmyo-200 transition duration-300"
        >
          Add New Promotion
        </button>
      </div>

      {!promotions.length ? (
        <div className="text-center p-10 bg-white rounded-xl shadow-lg">
          <p className="text-xl text-gray-500">
             No promotions found. Click 'Add New Promotion' to start.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
          {promotions.map((promotion) => (
            <div key={promotion._id} className="bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden flex flex-col">
              <div className="h-96 w-full overflow-hidden">
                <img 
                  src={promotion.PromotionImage} 
                  alt={promotion.PromotionName} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/600x400?text=Image+Unavailable"; }}
                />
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">{promotion.PromotionName}</h3>
                {promotion.Quota && (
                  <span className="text-xs font-medium text-zinc-900">{promotion.Quota}</span>
                )}
                <div className="flex gap-3 pt-3 border-t border-gray-100 mt-auto">
                  <Link 
                    to={`/admin/edit-promotion/${promotion._id}`} 
                    className="flex-1 text-center py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => setModalPromotionId(promotion._id)} // 🔹 Open modal
                    className="flex-1 text-center py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-zinmyo-200 hover:text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Delete Confirmation Modal */}
{modalPromotionId && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    {/* Transparent overlay with soft blur */}
    <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>

    {/* Modal Content */}
    <div className="relative flex flex-col items-center bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-200">
      <div className="flex items-center justify-center p-4 bg-red-100 rounded-full">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 className="text-gray-900 font-semibold mt-4 text-xl">Are you sure?</h2>
      <p className="text-sm text-gray-600 mt-2 text-center">
        Do you really want to continue? This action<br />cannot be undone.
      </p>
      <div className="flex items-center justify-center gap-4 mt-5 w-full">
        <button 
          type="button" 
          onClick={() => setModalPromotionId(null)} // Cancel modal
          className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition"
        >
          Cancel
        </button>
        <button 
          type="button" 
          onClick={() => handleDelete(modalPromotionId)} // Confirm delete
          className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ListPromotion;
