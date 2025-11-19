import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import Loading from "./Loading";
import BlurCircle from "./BlurCircle.jsx";

const LOCATIONS = ["Bangkok", "Central", "North", "South", "East"];

const CinemaSection = () => {
  const { axios } = useAppContext();
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("Bangkok");
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/cinema");
        if (data?.success) setCinemas(data.cinemas || []);
      } catch (err) {
        console.error("Failed to fetch cinemas", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const byLocation = (loc) =>
    cinemas.filter(
      (c) =>
        String(c.Location || "").toLowerCase() ===
        String(loc).toLowerCase()
    );

  if (loading) return <Loading />;

  return (
    <section className="max-w-7xl mx-auto mt-10 md:mt-24 px-4">
      <h2 className="text-3xl font-bold tracking-tight text-white">

        <BlurCircle top="100px" left="10px" />
        <BlurCircle bottom="10px" left="10px" />
        Cinemas
      </h2>

      {/* Tabs */}
      <div className="mt-6 flex gap-3 flex-wrap">
        {LOCATIONS.map((loc) => (
          <button
            key={loc}
            onClick={() => setActive(loc)}
            className={`px-5 py-2.5 text-xl uppercase cursor-pointer
              ${
                active === loc
                  ? "bg-none text-primary border-b-4 border-b-primary"
                  : "text-white"
              }
            `}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* Cinemas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {byLocation(active).length === 0 ? (
          <div className="text-gray-400 text-lg">
            No cinemas found for {active}.
          </div>
        ) : (
          byLocation(active).map((c) => (
            <div
              key={c._id}
              className=" backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-5 flex gap-5
              hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/cinemas/${c._id}`)}
            >
              {/* IMAGE */}
              <div className="w-44 flex-shrink-0 rounded-xl overflow-hidden bg-gray-950">
                {c.cinemaImage ? (
                  <img
                    src={c.cinemaImage}
                    alt={c.cinemaName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* DETAILS */}
              <div className="flex-1 text-white">
                <h3 className="text-lg font-bold leading-tight hover:text-primary transition-colors">
                  {c.cinemaName || c.name || "Unnamed Cinema"}
                </h3>

                <p className="text-sm text-gray-300 mt-1">
                  {c.Location}
                  {c.Area ? ` — ${c.Area}` : ""}
                </p>

                {c.address && (
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {/* {c.address} */}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CinemaSection;
