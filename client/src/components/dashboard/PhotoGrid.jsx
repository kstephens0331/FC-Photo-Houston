import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import PhotoCard from "./PhotoCard";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const PhotoGrid = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id);
    });
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data, error } = await supabase
          .from("photos")
          .select("*")
          .eq("user_id", userId)
          .eq("status", "approved")
          .eq("viewable", true)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setPhotos(data);
      } catch (error) {
        console.error("Error fetching photos:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPhotos();
    }
  }, [userId]);

  const updatePhoto = (id, updatedFields) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id ? { ...photo, ...updatedFields } : photo
      )
    );
  };

  const filteredPhotos = favoritesOnly
    ? photos.filter((photo) => photo.favorite === true)
    : photos;

  const allImageUrls = filteredPhotos.map(
    (photo) =>
      `https://atipokknjidtpidpkeej.supabase.co/storage/v1/object/public/photos/${photo.session_id}/${photo.user_id}/${photo.file_name}`
  );

  const handleOpenLightbox = (index) => {
    setLightboxImages(allImageUrls);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) return <p className="text-center py-12">Loading photos...</p>;

  return (
    <div className="px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Gallery</h2>
        <button
          onClick={() => setFavoritesOnly((prev) => !prev)}
          className={`px-4 py-2 rounded ${
            favoritesOnly ? "bg-yellow-400" : "bg-gray-200"
          }`}
        >
          {favoritesOnly ? "Show All" : "Show Favorites Only"}
        </button>
      </div>

      {filteredPhotos.length === 0 ? (
        <p className="text-gray-600">No {favoritesOnly ? "favorited" : "approved"} photos found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredPhotos.map((photo, index) => {
            const photoUrl = `https://atipokknjidtpidpkeej.supabase.co/storage/v1/object/public/photos/${photo.session_id}/${photo.user_id}/${photo.file_name}`;
            return (
              <div
                key={photo.id}
                onClick={() => handleOpenLightbox(index)}
                className="cursor-zoom-in"
              >
                <PhotoCard
                  photo={photo}
                  onUpdate={(fields) => updatePhoto(photo.id, fields)}
                />
              </div>
            );
          })}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          mainSrc={lightboxImages[lightboxIndex]}
          nextSrc={lightboxImages[(lightboxIndex + 1) % lightboxImages.length]}
          prevSrc={
            lightboxImages[
              (lightboxIndex + lightboxImages.length - 1) % lightboxImages.length
            ]
          }
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setLightboxIndex(
              (lightboxIndex + lightboxImages.length - 1) % lightboxImages.length
            )
          }
          onMoveNextRequest={() =>
            setLightboxIndex((lightboxIndex + 1) % lightboxImages.length)
          }
        />
      )}
    </div>
  );
};

export default PhotoGrid;
