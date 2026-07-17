import { Product } from "@/Models/Product";
import connectToDatabase from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { Collection } from "@/Models/Collection";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  console.log(page)
  await connectToDatabase();
  const skip = (page -1) * 6;
  try {
    const totalProducts = await Product.find({}).countDocuments(); // Fetch all products
    const products = await Product.find({}).populate("collection").skip(skip).limit(6); // Fetch products for the current page
   
    return NextResponse.json(
      {
        message: "Products fetched successfully",
        products,
        totalProducts,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        message: "Server error while fetching products",
      },
      { status: 500 },
    );
  }
}