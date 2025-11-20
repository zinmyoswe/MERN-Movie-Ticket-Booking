import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import Loading from "./Loading.jsx";
import BlurCircle from "./BlurCircle.jsx"; // Assuming this handles background visual flair

// Helper function to truncate text (optional, but good for phrases/descriptions)
const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};


const PromotionSection = () => {
  const { axios } = useAppContext();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/promotion");
        if (data?.success) setPromotions(data.promotions || []);
      } catch (err) {
        console.error("Failed to fetch promotions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  if (loading) return <Loading />;

  return (
    <section className="max-w-7xl mx-auto py-12 md:py-20 px-4 relative overflow-hidden">
      
      {/* Background Visual Flair (retaining BlurCircle) */}
      <BlurCircle top="20%" left="5%" className="opacity-50" />
      <BlurCircle bottom="10%" right="10%" className="opacity-50" />

      {/* Header Section */}
      <div className="text-center mb-12 mt-16">
        <h2 className="text-5xl font-extrabold tracking-tighter text-white mb-2 relative z-10">
         Promotions
        </h2>
        <p className="text-xl text-gray-400 relative z-10">
          Don't miss out on our limited-time offers and special deals.
        </p>
      </div>

      {promotions.length === 0 ? (
        <div className="text-center p-10 rounded-xl bg-white/5 text-gray-400 text-lg mt-6 border border-gray-700">
            Check back soon! No active promotions available right now.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 relative z-20">
          {promotions.map((promo) => (
            <article
              key={promo._id}
              className=" cursor-pointer rounded-2xl"
              onClick={() => navigate(`/promotions/${promo._id}`)} 
            >
              {/* IMAGE */}
              <div className="w-full h-full md:h-[424px] overflow-hidden">
                {promo.PromotionImage ? (
                  <img
                    src={promo.PromotionImage}
                    alt={promo.PromotionName}
                    className="w-full h-[424px] object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/600x400?text=Promotion+Image"; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                    No Image Available
                  </div>
                )}
              </div>

              {/* DETAILS */}
              <div className="mt-6 text-white flex flex-col justify-between flex-grow">
                <h3 className="text-lg font-bold mb-3 line-clamp-2 text-primary">
                    {promo.PromotionName}
                </h3>
               
                {/* Phrase/Quota Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                   
                    {promo.Quota && (
                  <span className="text-sm font-medium  text-white">
                        {promo.Quota}
                    </span>
                  )}
                </div>

         
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default PromotionSection;