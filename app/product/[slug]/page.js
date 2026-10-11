import connectToDatabase from "@/lib/dbConnect";
import { Product } from "@/Models/Product";
import ProductDetails from "@/components/ProductDetails";
import LatestProducts from "@/components/LatestProducts";
import ProductTabs from "@/components/Tabs";
import Rating from "@/components/Rating";

export default async function Page({ params }) {
  const { slug } = await params;

  await connectToDatabase();
  const product = await Product.findById(slug).lean();

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <ProductDetails product={JSON.stringify(product)} />
        <ProductTabs description={product.description} reviews={""}/>
        {/* Latest products */}
        <Rating item={JSON.stringify(product)}/>
        <LatestProducts />
      </div>
    </>
  );
}