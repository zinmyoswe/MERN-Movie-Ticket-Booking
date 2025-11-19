import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import Loading from "./Loading.jsx";
import BlurCircle from "./BlurCircle.jsx";

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
    <section className="max-w-7xl mx-auto mt-10 md:mt-24 px-4">
      <h2 className="text-3xl font-bold tracking-tight text-white relative">
        <BlurCircle top="100px" left="10px" />
        <BlurCircle bottom="10px" left="10px" />
        Promotions
      </h2>

      {promotions.length === 0 ? (
        <div className="text-gray-400 text-lg mt-6">No promotions available.</div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <div
              key={promo._id}
              className="backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/promotions/${promo._id}`)} // optional promotion detail page
            >
              {/* IMAGE */}
              <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-950 mb-4">
                {promo.PromotionImage ? (
                  <img
                    src={promo.PromotionImage}
                    alt={promo.PromotionName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* DETAILS */}
              <div className="text-white flex flex-col flex-grow">
                <h3 className="text-lg font-bold mb-2 line-clamp-2">{promo.PromotionName}</h3>
                {promo.PromotionPhrase && (
                  <p className="text-sm text-gray-300 mb-1">{promo.PromotionPhrase}</p>
                )}
                {promo.Quota && (
                  <p className="text-sm text-gray-400 mb-2">Quota: {promo.Quota}</p>
                )}
                {promo.PromotionDescription && (
                  <p
                    className="text-sm text-gray-400 line-clamp-3 flex-grow"
                    dangerouslySetInnerHTML={{ __html: promo.PromotionDescription }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PromotionSection;
