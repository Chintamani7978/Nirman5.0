import React, { useState, useEffect } from 'react';
import { Store, Search, RefreshCw, Phone, MapPin, User, Package, Wheat, Sprout, Tractor, TreePine, Apple, Carrot } from 'lucide-react';

// Types
interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: string | number;
  unit?: string;
  image: string;
  description?: string;
  farmerName: string;
  location?: string;
  contactNumber?: string;
}

interface ModalContent {
  type: string;
  title: string;
  content: React.ReactNode;
}

interface MarketplaceProps {
  showModal: (content: ModalContent) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ showModal }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://kisan-mitra-backend.vercel.app/api/products/products');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched products:', data); // For debugging
      
      // Handle different response structures
      const productsArray = Array.isArray(data) ? data : (data.products || data.data || []);
      
      setProducts(productsArray);
      setFilteredProducts(productsArray);
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // Set empty array on error and show user-friendly message
      setProducts([]);
      setFilteredProducts([]);
      
      // You could also set an error state here to show a proper error message
      // setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const contactFarmer = (farmerName: string, productName: string, contactNumber: string, location: string) => {
    const displayPhone = contactNumber || '+91 98765 43210';
    const displayLocation = location || 'Village Farming Area';

    showModal({
      type: 'contact',
      title: `Contact ${farmerName}`,
      content: (
        <div className="contact-modal">
          <div className="contact-icon">
            <Phone size={32} />
          </div>
          <p className="contact-product">
            Interested in <strong>{productName}</strong>?
          </p>
          <div className="contact-info">
            <h4>Contact Information</h4>
            <div className="info-list">
              <div className="info-item">
                <Phone size={16} />
                <span>{displayPhone}</span>
              </div>
              <div className="info-item">
                <User size={16} />
                <span>{farmerName}</span>
              </div>
              <div className="info-item">
                <MapPin size={16} />
                <span>{displayLocation}</span>
              </div>
            </div>
          </div>
          <div className="contact-actions">
            <a href={`tel:${displayPhone}`} className="call-btn">
              <Phone size={16} />
              Call Now
            </a>
          </div>
        </div>
      )
    });
  };

  if (loading) {
    return (
      <div className="marketplace-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading fresh produce...</p>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '8px' }}>
            Fetching the latest agricultural products
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="marketplace-container">
      <style jsx>{`
        .marketplace-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
          padding: 24px;
        }

        .marketplace-header {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-bottom: 32px;
          border: 1px solid #e2e8f0;
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title-section h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .title-icon {
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-section {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .search-container {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          color: #334155;
          background: #f8fafc;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #16a34a;
          background: white;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #f1f5f9;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .refresh-btn:hover {
          background: #e2e8f0;
          border-color: #cbd5e1;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          transition: all 0.3s;
          position: relative;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          border-color: #16a34a;
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          background: #f1f5f9;
        }

        .product-content {
          padding: 24px;
        }

        .product-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
          letter-spacing: -0.025em;
        }

        .product-price {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 18px;
          font-weight: 700;
          color: #059669;
          margin-bottom: 12px;
        }

        .product-description {
          font-size: 14px;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .product-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #475569;
        }

        .meta-icon {
          color: #64748b;
        }

        .contact-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .contact-btn:hover {
          background: linear-gradient(135deg, #15803d, #166534);
          transform: translateY(-1px);
        }

        .empty-state {
          text-align: center;
          padding: 80px 32px;
          color: #64748b;
        }

        .empty-icon {
          opacity: 0.3;
          margin-bottom: 20px;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          color: #64748b;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #16a34a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .contact-modal {
          text-align: center;
          padding: 32px;
          max-width: 400px;
        }

        .contact-icon {
          background: linear-gradient(135deg, #16a34a, #15803d);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: white;
        }

        .contact-product {
          font-size: 16px;
          color: #475569;
          margin-bottom: 24px;
        }

        .contact-info {
          background: rgba(22, 163, 74, 0.05);
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          border: 1px solid rgba(22, 163, 74, 0.1);
        }

        .contact-info h4 {
          color: #1e293b;
          margin-bottom: 16px;
          font-weight: 600;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #475569;
          font-weight: 500;
        }

        .contact-actions {
          display: flex;
          justify-content: center;
        }

        .call-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .call-btn:hover {
          background: linear-gradient(135deg, #15803d, #166534);
          transform: translateY(-1px);
        }
      `}</style>

      <div className="marketplace-header">
        <div className="header-top">
          <div className="title-section">
            <div className="title-icon">
              <Tractor size={24} />
            </div>
            <h1>Agricultural Marketplace</h1>
          </div>
        </div>
        
        <div className="search-section">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search for crops, grains, vegetables..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="refresh-btn" onClick={fetchProducts}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 && !loading ? (
        <div className="empty-state">
          <Wheat size={64} className="empty-icon" />
          <p>No agricultural products found.</p>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '8px' }}>
            Try adjusting your search or refresh to see available crops
          </p>
          <button 
            className="refresh-btn" 
            onClick={fetchProducts}
            style={{ marginTop: '16px' }}
          >
            <RefreshCw size={16} />
            Refresh Products
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product._id || product.id} className="product-card">
              <img 
                src={product.image}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PGNpcmNsZSBjeD0iMTYwIiBjeT0iNzAiIHI9IjE2IiBmaWxsPSIjMTZhMzRhIiBvcGFjaXR5PSIwLjMiLz48cGF0aCBkPSJNMTQ4IDg2bDEyLTEyIDEyIDEyIiBzdHJva2U9IiMxNmEzNGEiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iMC41Ii8+PHBhdGggZD0iTTE1MiA5Nmw4LTggOCA4IiBzdHJva2U9IiMxNmEzNGEiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iMC4zIi8+PHRleHQgeD0iMTYwIiB5PSIxMzAiIGZvbnQtZmFtaWx5PSJJbnRlciIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                }}
              />
              <div className="product-content">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">
                  <span style={{fontSize: '18px'}}>₹</span>
                  {product.price} {product.unit && `(${product.unit})`}
                </div>
                {product.description && (
                  <p className="product-description">
                    {product.description}
                  </p>
                )}
                <div className="product-meta">
                  <div className="meta-item">
                    <Sprout size={16} className="meta-icon" />
                    <span>Grown by {product.farmerName}</span>
                  </div>
                  {product.location && (
                    <div className="meta-item">
                      <MapPin size={16} className="meta-icon" />
                      <span>{product.location}</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <TreePine size={16} className="meta-icon" />
                    <span>Fresh & Organic</span>
                  </div>
                </div>
                <button 
                  className="contact-btn"
                  onClick={() => contactFarmer(
                    product.farmerName, 
                    product.name, 
                    product.contactNumber || '', 
                    product.location || ''
                  )}
                >
                  <Sprout size={16} />
                  Contact Farmer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;