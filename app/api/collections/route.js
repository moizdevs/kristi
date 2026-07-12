import fs from "fs";
import path from "path";
import { Collection } from "@/Models/Collection";
import { Product } from "@/Models/Product"; // Added import for Product model
import connectToDatabase from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

export async function GET() {
  await connectToDatabase();
  try {
    const collections = await Collection.find({}).populate('products');
    
     
    return NextResponse.json({ collections }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 });
  }
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  await connectToDatabase();
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const file = formData.get("image");
    const products = formData.getAll("products");

    let imagePath = "";

    // ✅ Cloudinary upload
    if (file && file.size > 0) {
      const fileData = await file.arrayBuffer();
      const buffer = Buffer.from(fileData);

      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'collections', // Cloudinary me organize karega
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      imagePath = uploadResult.secure_url; // ✅ Cloudinary URL
    }

    const newCollection = new Collection({
      name,
      description,
      image: imagePath,
      products,
    });
    await newCollection.save();

    // Update products
    if (products.length > 0) {
      await Product.updateMany(
        { _id: { $in: products } },
        { collection: newCollection._id }
      );
    }

    return NextResponse.json({ collection: newCollection }, { status: 201 });
  } catch (error) {
    console.log("Create collection error:", error);
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 }
    );
  }
}
export async function PUT(request) {
  await connectToDatabase();
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const name = formData.get("name");
    const description = formData.get("description");
    const file = formData.get("image");
    const products = formData.getAll("products"); // This will be an array of strings

    // Get the current collection
    const currentCollection = await Collection.findById(id);
    if (!currentCollection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    const currentProductIds = currentCollection.products.map(p => p.toString());
    const newProductIds = products;

    // Products to add: in new list but not in current
    const productsToAdd = newProductIds.filter(pid => !currentProductIds.includes(pid));

    // Products to remove: in current but not in new
    const productsToRemove = currentProductIds.filter(pid => !newProductIds.includes(pid));

    // Prepare update data
    let updateData = { name, description, products: newProductIds };

    if (file && file.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileData = await file.arrayBuffer();
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.promises.writeFile(filePath, Buffer.from(fileData));
      updateData.image = `/uploads/${fileName}`;
    }

    // Update collection
    const collection = await Collection.findByIdAndUpdate(id, updateData, { new: true });

    // Update products' collection field
    if (productsToAdd.length > 0) {
      await Product.updateMany({ _id: { $in: productsToAdd } }, { collection: id });
    }
    if (productsToRemove.length > 0) {
      await Product.updateMany({ _id: { $in: productsToRemove } }, { collection: null });
    }

    return NextResponse.json({ collection }, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
  }
}