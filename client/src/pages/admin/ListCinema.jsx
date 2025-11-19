import React, { useEffect, useState } from 'react';
import Title from '../../components/admin/Title';
import Loading from '../../components/Loading';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ListCinema = () => {
  const { axios, getToken, user } = useAppContext();
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCinemas = async () => {
    try {
      const { data } = await axios.get('/api/cinema');
      if (data.success) setCinemas(data.cinemas);
    } catch (error) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => { fetchCinemas(); }, [user]);

  return !loading ? (
    <>
      <Title text1="List" text2="Cinemas" />
      <div className="max-w-6xl mt-6 grid gap-6">
        {cinemas.length === 0 ? (
          <div className="text-gray-500">No cinemas found.</div>
        ) : (
          cinemas.map((c, i) => (
            <div key={c._id || i} className="flex flex-col md:flex-row bg-white rounded-lg shadow p-4 border">
              <div className="md:w-40 w-full flex-shrink-0">
                {c.cinemaImage ? (
                  <img src={c.cinemaImage} alt={c.cinemaName || c.name || c.title || 'Cinema image'} className="w-full h-36 md:h-28 object-cover rounded" />
                ) : (
                  <div className="w-full h-36 md:h-28 bg-gray-100 flex items-center justify-center rounded text-gray-400">No Image</div>
                )}
              </div>

              <div className="flex-1 md:pl-6 mt-4 md:mt-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-primary ">{c.cinemaName || 'Unnamed Cinema'}</h3>
                    <div className="text-sm text-gray-500">{c.Location}{c.Area ? ` — ${c.Area}` : ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">ID: {c.cinemaID || '-'}</div>
                    <div className="mt-2">
                      <button onClick={() => navigate(`/admin/edit-cinema/${c._id}`)} className="mr-3 border border-primary text-primary bg-transparent px-6 py-1 rounded-full hover:bg-primary hover:text-white transition-colors duration-200 cursor-pointer">Edit</button>
                      <button onClick={() => navigate(`/admin/delete-cinema/${c._id}`)} className="bg-primary text-white px-6 py-1 rounded-full hover:bg-zinmyo-200 transition-colors duration-200 cursor-pointer">Delete</button>
                    </div>
                  </div>
                </div>

                {c.cinemaInformation && (
                  <p className="mt-3 text-sm text-gray-700">{c.cinemaInformation}</p>
                )}

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                  <div><strong>Address:</strong><div>{c.address || '-'}</div></div>
                  <div><strong>Office Hours:</strong><div>{c.officeHours || '9:00 AM - 12:00 PM'}</div></div>
                  <div><strong>Transport:</strong><div>{c.Transport || "BTS 'Siam' Station : Exit No. 5 / MRT 'Samyarn' Station : Exit No. 1, 2 / Bus : 34, 59, 107, 129, 503, 63, 24, 178, 79"}</div></div>
                </div>

                {c.map && (
                  <div className="mt-3">
                    <a href={c.map} target="_blank" rel="noreferrer" className="text-sm text-primary underline">Open map</a>
                    <div className="mt-2">
                            {(() => {
                              // try to extract lat/lng from common Google Maps URL patterns
                              const extractCoords = (url) => {
                                if (!url) return null;
                                try {
                                  const u = String(url);
                                  // pattern: @lat,lng, (e.g. /@13.7563,100.5018,15z)
                                  const at = u.match(/@(-?\d+\.\d+),(-?\d+\.\d+),/);
                                  if (at) return { lat: at[1], lng: at[2] };
                                  // pattern: !3dLAT!4dLNG
                                  const d = u.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
                                  if (d) return { lat: d[1], lng: d[2] };
                                  // q=lat,lng
                                  const q = u.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
                                  if (q) return { lat: q[1], lng: q[2] };
                                  // short pattern with /place/.../@lat,lng,
                                  const placeAt = u.match(/@(-?\d+\.\d+),(-?\d+\.\d+),/);
                                  if (placeAt) return { lat: placeAt[1], lng: placeAt[2] };
                                } catch (e) {
                                  return null;
                                }
                                return null;
                              }

                              const coords = extractCoords(c.map);
                              if (coords) {
                                const embed = `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`;
                                return <iframe src={embed} title={`map-${c._id}`} className="w-full h-40 rounded border" />
                              }

                              // fallback: embed if it's explicitly an embed or OSM
                              const lower = String(c.map).toLowerCase();
                              const embeddable = lower.includes('/embed') || lower.includes('openstreetmap.org') || lower.includes('maps.app.goo.gl');
                              if (embeddable) {
                                return <iframe src={c.map} title={`map-${c._id}`} className="w-full h-40 rounded border" />
                              }

                              // not embeddable: show a helpful message and link
                              return <div className="text-sm text-gray-500">This map URL cannot be embedded. Click "Open map" to view in a new tab.</div>
                            })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  ) : <Loading />;
};

export default ListCinema;
