import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import Loading from "./Loading";
import BlurCircle from "./BlurCircle.jsx";
import { ArrowLeft } from "lucide-react";

const extractCoords = (url) => {
  if (!url) return null;
  try {
    const u = String(url);
    const at = u.match(/@(-?\d+\.\d+),(-?\d+\.\d+),/);
    if (at) return { lat: at[1], lng: at[2] };

    const d = u.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (d) return { lat: d[1], lng: d[2] };

    const q = u.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (q) return { lat: q[1], lng: q[2] };
  } catch (e) {
    return null;
  }
  return null;
};

const CinemaDetail = () => {
  const { id } = useParams();
  const { axios } = useAppContext();
  const [cinema, setCinema] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/cinema/${id}`);
        if (data?.success) setCinema(data.cinema || data.cinemas || null);
      } catch (err) {
        console.error("Failed to fetch cinema", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <Loading />;

  if (!cinema)
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4 text-white">
        Cinema not found.{" "}
        <Link to="/cinemas" className="text-primary underline">
          Back to list
        </Link>
      </div>
    );

  const coords = extractCoords(cinema.map);
  const embeddable = coords
    ? `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`
    : cinema.map &&
      (String(cinema.map).toLowerCase().includes("/embed") ||
        String(cinema.map).toLowerCase().includes("openstreetmap.org"))
    ? cinema.map
    : null;

  return (
    <div className="pb-16">
      {/* HERO BANNER */}
      {cinema.cinemaImage && (
        <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden">
          <img
            src={cinema.cinemaImage}
            alt="Cinema Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* CONTENT CARD */}
      <BlurCircle top="400px" left="10px" />
      
      
      <div className=" mx-auto -mt-14 px-4">
        <div className="">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {cinema.cinemaName ||
              cinema.name ||
              cinema.title ||
              "Unnamed Cinema"}
          </h1>

          <p className="mt-2 text-gray-300">
            {cinema.Location}
            {cinema.Area ? ` — ${cinema.Area}` : ""}
          </p>

          {cinema.cinemaInformation && (
            <p className="mt-4 text-gray-200 leading-relaxed">
              {cinema.cinemaInformation}
            </p>
          )}

          {/* INFO GRID */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-200 text-sm">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm">
              <h3 className="font-semibold text-white">Address</h3>
              <p className="mt-1">{cinema.address || "-"}</p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm">
              <h3 className="font-semibold text-white">Office Hours</h3>
              <p className="mt-1">{cinema.officeHours || "9:00 AM - 12:00 PM"}</p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm md:col-span-2">
              <h3 className="font-semibold text-white">Transport</h3>
              <p className="mt-1">{cinema.Transport || "-"}</p>
            </div>
          </div>

          {/* MAP SECTION */}
          {embeddable ? (
            <div className="mt-8">
              <h3 className="mb-2 text-white font-semibold">Location Map</h3>
              <iframe
                src={embeddable}
                title={`map-${cinema._id}`}
                className="w-full h-64 md:h-80 rounded-2xl border border-white/20 shadow-2xl"
              />
            </div>
          ) : cinema.map ? (
            <div className="mt-6 text-sm text-gray-300">
              This map URL cannot be embedded.{" "}
              <a
                href={cinema.map}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                Open map
              </a>
            </div>
          ) : null}

          {/* BACK BUTTON */}
          <div className="mt-10">
            <Link
              to="/cinemas"
              className="px-6 py-4 bg-none border border-primary rounded-full text-primary hover:bg-zinmyo-200 hover:text-white transition"
            >
            Back to Cinemas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemaDetail;
