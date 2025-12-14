import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Building2, ChevronRight } from 'lucide-react'; // Added icons for better UI
import { useAppContext } from "../context/AppContext.jsx";
import Loading from "./Loading";
import BlurCircle from "./BlurCircle.jsx";

// --- Constants for Readability & Consistency ---
const LOCATIONS = ["Bangkok", "Central", "North", "South", "East"];
const SECTION_PADDING = 'px-6 md:px-16 lg:px-24 xl:px-44';
const TAB_BUTTON_CLASSES = 'px-4 py-2 text-base font-medium transition-all duration-300 ease-in-out rounded-full';

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
    }, [axios]); // Added axios to dependency array

    const byLocation = (loc) =>
        cinemas.filter(
            (c) =>
                String(c.Location || "").toLowerCase() ===
                String(loc).toLowerCase()
        );

    if (loading) return <Loading />;

    // Calculate dynamic styles for the container to match overall app design
    const containerClasses = `relative ${SECTION_PADDING} mt-16 md:mt-24 pb-20 overflow-hidden`;

    return (
        <section className={containerClasses}>
            
            {/* Background Blurs */}
            <BlurCircle top="100px" left="-100px" />
            <BlurCircle bottom="10px" right="50px" />
            
            {/* Section Header */}
            <header className="mb-12 md:mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                    Find Cinemas <span className='text-primary'>Near You</span>
                </h2>
                <p className='text-lg text-gray-400 mt-2'>
                    Select a region to view available theaters and book your tickets.
                </p>
            </header>

            {/* Tabs (Segmented Control look) */}
            <div className="flex gap-2 flex-wrap p-1 bg-zinc-900 rounded-full w-fit">
                {LOCATIONS.map((loc) => (
                    <button
                        key={loc}
                        onClick={() => setActive(loc)}
                        className={`
                            ${TAB_BUTTON_CLASSES}
                            ${active === loc
                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                : "text-gray-400 hover:text-white hover:bg-zinc-800"
                            }
                        `}
                    >
                        {loc}
                    </button>
                ))}
            </div>

            {/* Cinemas Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {byLocation(active).length === 0 ? (
                    <div className="col-span-full bg-zinc-800/50 p-8 rounded-xl text-center text-gray-400 text-lg flex items-center justify-center h-48">
                        <MapPin className="w-6 h-6 mr-3 text-primary" />
                        No cinemas found in the **{active}** region.
                    </div>
                ) : (
                    byLocation(active).map((c) => (
                        <div
                            key={c._id}
                            className="
                                backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl 
                                p-4 flex gap-4 items-center
                                hover:border-primary hover:shadow-primary/20 hover:shadow-xl 
                                transition-all duration-300 cursor-pointer
                            "
                            onClick={() => navigate(`/cinemas/${c._id}`)}
                        >
                            
                            {/* IMAGE */}
                            <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
                                {c.cinemaImage ? (
                                    <img
                                        src={c.cinemaImage}
                                        alt={c.cinemaName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                )}
                            </div>

                            {/* DETAILS */}
                            <div className="flex-1 text-white">
                                <h3 className="text-xl font-semibold leading-snug hover:text-primary transition-colors">
                                    {c.cinemaName || c.name || "Unnamed Cinema"}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {c.Area ? `${c.Area}, ` : ""} {c.Location}
                                </p>
                            </div>

                            {/* ACTION ICON */}
                            <ChevronRight className="w-6 h-6 text-primary flex-shrink-0" />
                            
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default CinemaSection;