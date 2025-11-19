// PromotionDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import Loading from "./Loading.jsx";
import { ArrowLeft } from "lucide-react";

const PromotionDetail = () => {
  const { id } = useParams();
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/promotion/${id}`);
        if (data.success) {
          setPromotion(data.promotion);
        }
      } catch (err) {
        console.error("Failed to fetch promotion", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotion();
  }, [id]);

  if (loading) return <Loading />;

  if (!promotion)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500">Promotion not found.</p>
      </div>
    );

  return (
    <section className="max-w-4xl mx-auto mt-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary mb-6 font-medium"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* IMAGE */}
        <div className="w-full h-96 overflow-hidden bg-gray-950">
          {promotion.PromotionImage ? (
            <img
              src={promotion.PromotionImage}
              alt={promotion.PromotionName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
              No Image
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-6 flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {promotion.PromotionName}
          </h1>
          {promotion.PromotionPhrase && (
            <p className="text-gray-700">{promotion.PromotionPhrase}</p>
          )}
          {promotion.Quota && (
            <p className="text-gray-500 font-medium">Quota: {promotion.Quota}</p>
          )}
          {promotion.PromotionDescription && (
            <div
              className="text-gray-700 mt-3"
              dangerouslySetInnerHTML={{ __html: promotion.PromotionDescription }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default PromotionDetail;
