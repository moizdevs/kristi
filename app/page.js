"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/cart/cartSlice"; // Adjust path to your cartSlice
import { ShoppingCart02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Banner from "@/components/Banner";
import Terms from "@/components/Terms";
import HighlightSection from "@/components/HighLightSection";
import TestimonialSection from "@/components/TestimonialsSection";
import Hero from "@/components/Hero";
import Collections from "@/components/Collections";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [addingId, setAddingId] = useState(null);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Banner />

      <h1 className="text-3xl max-[600px]:text-xl max-[600px]:my-6 max-[600px]:mx-9 font-bold my-12 mx-18">
        Shop by Collection
      </h1>
      <Collections />

      <h1 className="text-3xl max-[600px]:text-xl max-[600px]:my-6 max-[600px]:mx-9 font-bold my-12 mx-18">
        Trending Products
      </h1>

      <div className="grid grid-cols-4 max-[1200px]:grid-cols-3 max-[930px]:grid-cols-2 mx-auto w-11/12 gap-2 mb-4 md:mb-6">
        {products.slice(0, 8).map(
          (
            product, // Show only first 8 products
          ) => (
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
                  <div className="absolute  inset-0 bg-black/5 max-[500px]:opacity-100 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
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
                          <HugeiconsIcon className="max-[500px]:hidden inline-block" icon={ShoppingCart02Icon} size={22} />{" "}
                          Add to Cart
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col items-center text-center">
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
          ),
        )}
      </div>

      {/* View All Button */}
      <div className="text-center md:mb-12 mb-8">
        <Link href="/shop">
          <button className="bg-[#111111] text-white rounded-full px-4 py-1 md:px-10 md:py-3  cursor-pointer hover:translate-y-1 hover:bg-black hover:text-white transition-all duration-300 uppercase text-[12px] md:text-sm font-bold tracking-tighter">
            View All Products
          </button>
        </Link>
      </div>

      <HighlightSection />
      <TestimonialSection />
      <Hero />
      <Terms />
    </>
  );
}
