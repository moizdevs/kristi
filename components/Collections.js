"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, AlertCircle, Boxes } from "lucide-react";

const CollectionSkeleton = () => (
  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-200 animate-pulse">
    <div className="absolute inset-0 bg-linear-to-t from-gray-300 to-transparent" />
  </div>
);

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error

  const fetchCollections = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/collections");
      if (!res.ok) throw new Error(`Failed with status ${res.status}`);
      const data = await res.json();

      const parsed = Array.isArray(data)
        ? data
        : Array.isArray(data?.collections)
        ? data.collections
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setCollections(parsed);
      setStatus(parsed.length > 0 ? "success" : "empty");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="w-full">

      {/* Grid */}
      <div className="px-3 sm:px-4 md:px-6 pb-8">
        {status === "loading" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CollectionSkeleton key={i} />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <AlertCircle size={32} className="text-gray-400" />
            <p className="text-sm text-gray-600">
              Couldn't load collections. Check your connection and try again.
            </p>
            <button
              onClick={fetchCollections}
              className="mt-2 px-5 py-2 text-xs font-bold uppercase tracking-widest bg-black text-white hover:scale-[0.98] transition-transform"
            >
              Retry
            </button>
          </div>
        )}

        {status === "empty" && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <Boxes size={32} className="text-gray-400" />
            <p className="text-sm text-gray-600">
              No collections available yet.
            </p>
          </div>
        )}

        {status === "success" && collections.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {collections.map((collection) => (
              <Link
                key={collection._id}
                href={`/collection/${collection._id}`}
                className="group"
              >
                {/* Card Container */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                  {/* Image */}
                  <img
                    src={collection.image}
                    alt={collection.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Dark Overlay - Subtle */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-100 group-hover:from-black/70 group-hover:via-black/30 transition-all duration-300" />

                  {/* Product Count Badge */}
                  {collection.productCount && (
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      <span className="text-xs font-bold text-black">
                        {collection.productCount}
                      </span>
                    </div>
                  )}

                  {/* Content - Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 flex flex-col justify-end">
                    {/* Collection Description/Category */}
                    {collection.category && (
                      <span className="text-[10px] text-white/80 uppercase tracking-wider mb-1">
                        {collection.category}
                      </span>
                    )}

                    {/* Collection Name */}
                    <h3 className="text-sm sm:text-base font-black text-white line-clamp-2 mb-2 group-hover:line-clamp-none transition-all">
                      {collection.name}
                    </h3>

                    {/* CTA - Only visible on hover (desktop) or always (mobile) */}
                    <div className="flex items-center gap-2 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-sm:opacity-100">
                      <span className="uppercase tracking-wide">View</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Focus Ring for Accessibility */}
                  <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-focus-within:ring-blue-500 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;