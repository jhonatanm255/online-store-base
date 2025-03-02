import { useState } from "react";
import toast from "react-hot-toast";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "./Sidebar";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, price: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const uploadImage = async () => {
    if (!image) return null;
    const fileExt = image.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("products")
      .upload(fileName, image);

    if (error) {
      console.error("Error al subir la imagen:", error.message);
      toast.error(`Error al subir la imagen: ${error.message}`);
      return null;
    }
    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = await uploadImage();
      if (!imageUrl) throw new Error("No se pudo subir la imagen.");

      await addDoc(collection(db, "products"), {
        ...formData,
        price: parseFloat(formData.price),
        imageUrl,
        createdAt: new Date(),
      });

      toast.success("Producto agregado con éxito!");
      setTimeout(() => {
        setFormData({ name: "", description: "", price: "", category: "" });
        setImage(null);
        setPreview(null);
      }, 1000);
    } catch (error: any) {
      console.error("Error al agregar producto:", error);
      toast.error(error.message || "Error al agregar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen mt-[64px]">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">
          Admin Dashboard - Agregar Producto
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Precio (MXN)
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handlePriceChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              <option value="Living-Room">Living Room</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Dining">Dining</option>
              <option value="Office">Office</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Imagen del Producto
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="mt-2 w-32 h-32 object-cover"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md disabled:bg-gray-400"
          >
            {loading ? "Agregando..." : "Agregar Producto"}
          </button>
        </form>
      </div>
    </div>
  );
}