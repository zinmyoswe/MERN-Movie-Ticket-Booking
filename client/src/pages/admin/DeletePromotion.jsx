import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const DeletePromotion = () => {
  const { axios, getToken } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [promotion, setPromotion] = useState(null);

  const fetchPromotion = async () => {
    try {
      const { data } = await axios.get(`/api/promotion/${id}`);
      if (data.success) setPromotion(data.promotion);
    } catch (error) {
      toast.error('Promotion not found');
    }
  };

  useEffect(() => {
    fetchPromotion();
  }, []);

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`/api/promotion/${id}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success('Promotion deleted');
        navigate('/admin/list-promotions');
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (!promotion) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <Title text1="Delete" text2="Promotion" />

      <div className="bg-white p-6 rounded-xl shadow max-w-xl mt-6">
        <h2 className="text-xl font-bold mb-3">{promotion.PromotionName}</h2>
        <img src={promotion.PromotionImage} className="h-40 rounded" />

        <p className="mt-4 text-gray-700">
          Are you sure you want to delete this promotion?
        </p>

        <button onClick={handleDelete} className="btn-danger mt-4">
          Yes, Delete
        </button>
      </div>
    </div>
  );
};

export default DeletePromotion;
