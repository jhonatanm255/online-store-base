import { Link } from "react-router-dom";
import { X } from "lucide-react";


const Cancel = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center lg:mt-[64px] py-16">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          <X className="text-2xl w-36 h-36 bg-red-100 p-8 rounded-full flex justify-center mx-auto mb-8" />
          ¡Compra Cancelada!
        </h1>
        <p className="text-gray-700 mb-6">
          Lamentamos que no hayas completado tu compra. Puedes volver a intentar
          en cualquier momento.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Regresar a la tienda
        </Link>
      </div>
    </div>
  );
};

export default Cancel;
