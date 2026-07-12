import { Collection } from "@/Models/Collection";
import ProductAddCard from "@/app/components/CollecProdAddCard";
import connectToDatabase from "@/lib/dbConnect";
import { Product } from "@/Models/Product";

const page = async ({ params }) => {
  const { collection_id } =await params;
  await connectToDatabase();
  const collection = await Collection.findById(collection_id).populate(
    "products"
  );
  const products = collection.products;
  
  return (
    <>
    <ProductAddCard products={JSON.stringify(products)} title={collection.name}/>
    </>
  );
};

export default page;
