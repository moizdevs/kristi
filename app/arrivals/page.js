"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/cart/cartSlice";
import Link from "next/link";
import {
  ShoppingCart02Icon,
  Alert02Icon,
  PackageIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const PRODUCT_LIMIT = 8;

const ProductSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-sm overflow-hidden animate-pulse">
    <div className="h-58 md:h-74 bg-gray-200" />
    <div className="p-4 flex flex-col items-center">
      <div className="h-2 w-20 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
      <div className="h-2 w-24 bg-gray-200 rounded mb-3" />
      <div className="h-3 w-16 bg-gray-200 rounded" />
    </div>
  </div>
);

const Page = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [addingId, setAddingId] = useState(null);
  const dispatch = useDispatch();

  const fetchNewProducts = async () => {
    setStatus("loading");
    try {
      const req = await fetch("/api/arrivals");
      if (!req.ok) throw new Error(`Request failed with status ${req.status}`);
      const res = await req.json();
      setNewProducts(res.products);
      setStatus("success");
    } catch (error) {
      console.error("Error fetching new products:", error);
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchNewProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingId(product._id);
    dispatch(
      addItem({
        id: product._id,
        title: product.title,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        image: product.images?.[0] || "",
      }),
    );
    setTimeout(() => setAddingId(null), 1200);
  };

  return (
    <div className="w-11/12 mx-auto">
      <div className="flex flex-col items-center text-center pt-8 pb-6 md:pt-12 md:pb-10">
        <span className="text-[10px] text-gray-400 uppercase tracking-[0.3em] mb-2">
          Just Landed
        </span>
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900">
          New Arrivals
        </h1>
      </div>

      {status === "loading" && (
        <div className="grid grid-cols-4 max-[1200px]:grid-cols-3 max-[930px]:grid-cols-2 gap-2 mb-4 md:mb-6">
          {Array.from({ length: PRODUCT_LIMIT }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center text-center py-20 gap-3">
          <HugeiconsIcon
            icon={Alert02Icon}
            size={32}
            className="text-gray-400"
          />
          <p className="text-sm text-gray-600">
            Couldn't load new arrivals. Check your connection and try again.
          </p>
          <button
            onClick={fetchNewProducts}
            className="mt-1 px-5 py-2 text-xs font-bold uppercase tracking-widest bg-black text-white hover:scale-[0.98] transition-transform"
          >
            Retry
          </button>
        </div>
      )}

      {status === "success" && newProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 gap-3">
          <HugeiconsIcon
            icon={PackageIcon}
            size={32}
            className="text-gray-400"
          />
          <p className="text-sm text-gray-600">
            No new arrivals yet. Check back soon.
          </p>
        </div>
      )}

      {status === "success" && newProducts.length > 0 && (
        <div className="grid grid-cols-4 max-[1200px]:grid-cols-3 max-[930px]:grid-cols-2 gap-2 mb-4 md:mb-6">
          {newProducts.map((product) => (
            <Link key={product._id} href={`/product/${product._id}`}>
              <div className="group relative bg-white border border-gray-100 rounded-sm overflow-hidden ">
                {/* Image */}
                <div className="relative h-58 md:h-74 overflow-hidden bg-[#f3f3f3]">
                  <img
                    src={product.images?.[0] || product.images?.[1]}
                    alt={product.title}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Sale Badge */}
                  {product.compareAtPrice > product.price && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                      {Math.round(
                        (product.price * 100) / product.compareAtPrice,
                      )}
                      % off
                    </span>
                  )}

                  {/* Add to Cart */}
                  <div className="absolute  inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setAddingId(product._id);
                        dispatch(
                          addItem({
                            id: product._id,
                            title: product.title,
                            price: product.price,
                            compareAtPrice: product.compareAtPrice,
                            image: product.images?.[0] || "",
                          }),
                        );
                        setTimeout(() => setAddingId(null), 1200);
                      }}
                      className={`w-full cursor-pointer py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                        addingId === product._id
                          ? "bg-black text-white scale-95 ring-2 ring-green-300"
                          : "bg-black text-white hover:scale-[0.98]"
                      }`}
                    >
                      {addingId === product._id ? (
                        "Added ✓"
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <HugeiconsIcon icon={ShoppingCart02Icon} size={22} />{" "}
                          Add to Cart
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col items-center text-center">
                  <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1">
                    Premium Selection
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-blue-900 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mb-3 max-w-[90%] uppercase tracking-tighter">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-3">
                    {product.compareAtPrice > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        Rs.{product.compareAtPrice}
                      </span>
                    )}
                    <span className="text-sm font-black text-black">
                      Rs.{product.price}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
