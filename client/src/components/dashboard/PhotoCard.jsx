import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ProtectedOverlay from "./ProtectedOverlay";

const PhotoCard = ({ photo, onUpdate }) => {
  const { url, paid, favorited, note } = photo;

  return (
    <div className="relative border rounded-lg overflow-hidden shadow-md group bg-white">
      <div className="relative">
        <img
          src={url}
          alt="Customer upload"
          className="w-full h-48 object-cover select-none pointer-events-none"
          draggable="false"
        />
        {!paid && <ProtectedOverlay />}
        <button
          onClick={() => onUpdate({ favorited: !favorited })}
          className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-md z-10 text-red-500"
        >
          {favorited ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <div className="p-3 bg-[#f9f8f6]">
        <textarea
          value={note}
          placeholder="Add a note..."
          rows={2}
          onChange={(e) => onUpdate({ note: e.target.value })}
          className="w-full p-2 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-black bg-white resize-none"
        />
      </div>
    </div>
  );
};

export default PhotoCard;
