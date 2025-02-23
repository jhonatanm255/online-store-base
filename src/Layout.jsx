import ProductForm from "./pages/admin/ProductForm"; // Asegúrate de que la ruta sea correcta

function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/productsform" element={<AdminProducts />} />
            <Route path="/admin/products/new" element={<ProductForm />} />{" "}
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />} {/* Ocultar footer en admin */}
      <Toaster position="bottom-right" />
    </div>
  );
}
