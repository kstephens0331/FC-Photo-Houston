import React from "react";

const ProtectedOverlay = () => (
  <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-10 flex items-center justify-center text-white text-xs text-center px-2">
    This photo is locked. Purchase required to unlock download or save.
  </div>
);

export default ProtectedOverlay;
