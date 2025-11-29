import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Save,
  X,
  Upload,
} from "lucide-react";
import { User, Product, ModalContent } from "../types";

interface ProductsManagerProps {
  currentUser: User;
  showModal: (content: ModalContent) => void;
}

const ProductsManager: React.FC<ProductsManagerProps> = ({
  currentUser,
  showModal,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: 0,
    unit: "",
    contactNumber: "",
    location: "",
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        // "https://kisan-mitra-backend.vercel.app/api/products/products"
        "https://kisan-mitra-backend.vercel.app/api/products/products"
      );
      const allProducts = await response.json();
      const myProducts = allProducts.filter(
        (p: Product) => p.aadhaar === currentUser.aadhaar
      );
      setProducts(myProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string, productName: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      try {
        const response = await fetch(
          `https://kisan-mitra-backend.vercel.app/api/products/products/${productId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          showModal({
            type: "success",
            title: "Success",
            content: <p>Product deleted successfully!</p>,
          });
          fetchMyProducts();
        } else {
          const data = await response.json();
          throw new Error(data.message || "Delete failed");
        }
      } catch (error) {
        showModal({
          type: "error",
          title: "Error",
          content: <p>Failed to delete product: {(error as Error).message}</p>,
        });
      }
    }
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      unit: product.unit || "",
      contactNumber: product.contactNumber || "",
      location: product.location || "",
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditFormData({
      name: "",
      description: "",
      price: 0,
      unit: "",
      contactNumber: "",
      location: "",
    });
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      showModal({
        type: "error",
        title: "Error",
        content: <p>Geolocation is not supported by your browser.</p>,
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const locationName =
            data.display_name ||
            `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setEditFormData((prev) => ({
            ...prev,
            location: locationName,
          }));
        } catch (error) {
          showModal({
            type: "error",
            title: "Error",
            content: (
              <p>Could not retrieve location details. Please try again.</p>
            ),
          });
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        showModal({
          type: "error",
          title: "Error",
          content: (
            <p>
              Could not get your location. Please make sure location services
              are enabled.
            </p>
          ),
        });
        setIsGettingLocation(false);
      },
      { timeout: 10000 }
    );
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProduct) return;

    // Validate required fields
    if (!editFormData.name || !editFormData.price || !editFormData.unit) {
      showModal({
        type: "error",
        title: "Validation Error",
        content: <p>Please fill in all required fields (marked with *)</p>,
      });
      return;
    }

    try {
      const response = await fetch(
        `https://kisan-mitra-backend.vercel.app/api/products/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        }
      );

      if (response.ok) {
        showModal({
          type: "success",
          title: "Success",
          content: <p>Product updated successfully!</p>,
        });
        setEditingProduct(null);
        fetchMyProducts();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Update failed");
      }
    } catch (error) {
      showModal({
        type: "error",
        title: "Error",
        content: <p>Failed to update product: {(error as Error).message}</p>,
      });
    }
  };

  if (loading) {
    return (
      <div className="tab-content active">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div className="loading"></div>
          <p style={{ marginTop: "20px", color: "#666" }}>
            Loading your products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content active">
      {/* Edit Modal */}
      {editingProduct && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              maxWidth: "550px",
              width: "100%",
              maxHeight: "100vh",
              backgroundColor: "white",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "25px 30px",
                borderBottom: "2px solid #f0f0f0",
                background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #2563eb, #4CAF50)",
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "15px",
                  color: "white",
                }}
              >
                <Edit size={20} />
              </div>
              <h3
                style={{
                  color: "#2563eb",
                  margin: 0,
                  fontSize: "1.4rem",
                  fontWeight: 600,
                }}
              >
                Edit Product
              </h3>
            </div>

            {/* Body */}
            <div
              style={{ padding: "30px", overflowY: "auto", maxHeight: "60vh" }}
            >
              <form onSubmit={handleEditSubmit}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {/* Name */}
                  <div>
                    <label
                      style={{
                        fontWeight: 600,
                        color: "#2c3e50",
                        fontSize: "14px",
                        marginBottom: "5px",
                        display: "block",
                      }}
                    >
                      Product Name <span style={{ color: "#e74c3c" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditInputChange}
                      style={{
                        padding: "12px 15px",
                        border: "2px solid #e1e8ed",
                        borderRadius: "10px",
                        fontSize: "14px",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      style={{
                        fontWeight: 600,
                        color: "#2c3e50",
                        fontSize: "14px",
                        marginBottom: "5px",
                        display: "block",
                      }}
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditInputChange}
                      rows={3}
                      style={{
                        padding: "12px 15px",
                        border: "2px solid #e1e8ed",
                        borderRadius: "10px",
                        fontSize: "14px",
                        width: "100%",
                        boxSizing: "border-box",
                        resize: "vertical",
                        minHeight: "80px",
                        fontFamily: "inherit",
                      }}
                      placeholder="Brief description of your product"
                    />
                  </div>

                  {/* Price and Unit */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                    }}
                  >
                    {/* Price */}
                    <div>
                      <label
                        style={{
                          fontWeight: 600,
                          color: "#2c3e50",
                          fontSize: "14px",
                          marginBottom: "5px",
                          display: "block",
                        }}
                      >
                        Price <span style={{ color: "#e74c3c" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <span
                          style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#666",
                            fontWeight: 500,
                          }}
                        >
                          ₹
                        </span>
                        <input
                          type="number"
                          name="price"
                          value={editFormData.price}
                          onChange={handleEditInputChange}
                          style={{
                            padding: "12px 15px 12px 30px",
                            border: "2px solid #e1e8ed",
                            borderRadius: "10px",
                            fontSize: "14px",
                            width: "100%",
                            boxSizing: "border-box",
                          }}
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    {/* Unit */}
                    <div>
                      <label
                        style={{
                          fontWeight: 600,
                          color: "#2c3e50",
                          fontSize: "14px",
                          marginBottom: "5px",
                          display: "block",
                        }}
                      >
                        Unit <span style={{ color: "#e74c3c" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="unit"
                        value={editFormData.unit}
                        onChange={handleEditInputChange}
                        style={{
                          padding: "12px 15px",
                          border: "2px solid #e1e8ed",
                          borderRadius: "10px",
                          fontSize: "14px",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                        required
                        placeholder="e.g., per kg, per piece"
                      />
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label
                      style={{
                        fontWeight: 600,
                        color: "#2c3e50",
                        fontSize: "14px",
                        marginBottom: "5px",
                        display: "block",
                      }}
                    >
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={editFormData.contactNumber}
                      onChange={handleEditInputChange}
                      style={{
                        padding: "12px 15px",
                        border: "2px solid #e1e8ed",
                        borderRadius: "10px",
                        fontSize: "14px",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label
                      style={{
                        fontWeight: 600,
                        color: "#2c3e50",
                        fontSize: "14px",
                        marginBottom: "5px",
                        display: "block",
                      }}
                    >
                      Location
                    </label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input
                        type="text"
                        name="location"
                        value={editFormData.location}
                        onChange={handleEditInputChange}
                        style={{
                          padding: "12px 15px",
                          border: "2px solid #e1e8ed",
                          borderRadius: "10px",
                          fontSize: "14px",
                          flex: 1,
                          boxSizing: "border-box",
                        }}
                        placeholder="e.g., Village Name, District"
                      />
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        style={{
                          padding: "12px 16px",
                          border: "2px solid #2563eb",
                          background: "white",
                          color: "#2563eb",
                          borderRadius: "10px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <MapPin size={14} />
                        {isGettingLocation ? "Getting..." : "Get Location"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
                padding: "20px 30px",
                borderTop: "1px solid #f0f0f0",
                background: "#fafbfc",
              }}
            >
              <button
                onClick={cancelEdit}
                style={{
                  padding: "12px 20px",
                  border: "2px solid #e1e8ed",
                  background: "white",
                  color: "#64748b",
                  borderRadius: "10px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  background: "linear-gradient(135deg, #2563eb, #4CAF50)",
                  color: "white",
                  borderRadius: "10px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Package size={20} />
            My Products
          </div>
          <button
            className="btn btn-primary"
            onClick={() => (window.location.hash = "api/products/upload")}
          >
            <Upload size={16} />
            Upload Product
          </button>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            <Upload size={48} style={{ opacity: 0.3, marginBottom: "20px" }} />
            <p style={{ marginBottom: "20px" }}>
              You haven't uploaded any products yet.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => (window.location.hash = "upload")}
            >
              <Upload size={16} />
              Upload Your First Product
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product._id || product.id} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1iZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                  }}
                />
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-price">
                    ₹{product.price} {product.unit && `(${product.unit})`}
                  </div>
                  {product.description && (
                    <div
                      className="product-description"
                      style={{
                        fontSize: "0.85rem",
                        color: "#666",
                        margin: "8px 0",
                        lineHeight: "1.4",
                      }}
                    >
                      {product.description}
                    </div>
                  )}
                  {product.location && (
                    <div
                      className="product-location"
                      style={{
                        fontSize: "0.85rem",
                        color: "#777",
                        marginTop: "4px",
                      }}
                    >
                      <MapPin size={12} /> {product.location}
                    </div>
                  )}
                  <div
                    style={{ marginTop: "15px", display: "flex", gap: "8px" }}
                  >
                    <button
                      className="btn btn-primary"
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: "0.85rem",
                      }}
                      onClick={() => startEditProduct(product)}
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      className="btn"
                      style={{
                        background: "#F44336",
                        color: "white",
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: "0.85rem",
                      }}
                      onClick={() =>
                        deleteProduct(
                          product._id || product.id || "",
                          product.name
                        )
                      }
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsManager;
