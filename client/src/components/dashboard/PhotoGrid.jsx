import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import PhotoCard from "./PhotoCard";

const PhotoGrid = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Get the current user and session ID
    supabase.auth.getUser().then(({ data: { user } }) => {
      setSessionId(user?.id);
    });
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data, error } = await supabase
          .from("photos")
          .select("*")
          .eq("sessionId", sessionId);

        if (error) throw error;

        setPhotos(data);
      } catch (error) {
        console.error("Error fetching photos:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchPhotos();
    }
  }, [sessionId]);

  const updatePhoto = (id, updatedFields) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id ? { ...photo, ...updatedFields } : photo
      )
    );
    // Optionally update Supabase row here
  };

  if (loading) return <p>Loading photos...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Gallery</h2>
      {photos.length === 0 ? (
        <p className="text-gray-600">No photos found for your session.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onUpdate={(fields) => updatePhoto(photo.id, fields)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;
