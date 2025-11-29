import React, { useState } from 'react';
import { Upload, MapPin, UploadCloud as CloudUpload, Scale, Info } from 'lucide-react';
import { User } from '../types';

interface ProductUploadProps {
  currentUser: User;
  onSuccess: () => void;
}

const ProductUpload: React.FC<ProductUploadProps> = ({ currentUser, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    unit: 'kg', // Default unit
    description: '',
    location: '',
    contactNumber: '',
    image: null as File | null,
    category: ''
  });
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [showUnitInfo, setShowUnitInfo] = useState(false);

  const agriculturalUnits = [
    { value: 'kg', label: 'kg' },
    { value: 'quintal', label: 'quintal (100 kg)' },
    { value: 'ton', label: 'ton (1000 kg)' },
    { value: 'bag', label: 'bag' },
    { value: 'piece', label: 'piece' },
    { value: 'dozen', label: 'dozen' },
    { value: 'litre', label: 'litre' },
    { value: 'bundle', label: 'bundle' },
    { value: 'sack', label: 'sack' }
  ];

  const productCategories = [
    'Cereals',
    'Pulses',
    'Vegetables',
    'Fruits',
    'Spices',
    'Dairy',
    'Poultry',
    'Flowers',
    'Seeds',
    'Organic Products',
    'Herbs',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const addr = data.address;
            let address = '';
            if (addr.village || addr.town || addr.city || addr.municipality) {
              address = addr.village || addr.town || addr.city || addr.municipality;
            }
            if (addr.county || addr.state_district) {
              address += address ? `, ${addr.county || addr.state_district}` : (addr.county || addr.state_district);
            }
            if (addr.state) {
              address += address ? `, ${addr.state}` : addr.state;
            }
            setFormData(prev => ({ ...prev, location: address || data.display_name.split(',').slice(0, 3).join(', ') }));
          }
        } catch (error) {
          setFormData(prev => ({ ...prev, location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
        }
      },
      (error) => {
        alert('Unable to get location. Please enter manually.');
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setResponse('');

    // Validate form data
    if (!formData.quantity || !formData.unit) {
      setResponse(`
        <div class="card" style="margin-top: 20px; text-align: center; padding: 20px; background: rgba(244, 67, 54, 0.05); border: 2px solid #F44336;">
          <div style="background: #F44336; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; color: white; font-size: 1.5rem;">
            <i class="fas fa-times"></i>
          </div>
          <h3 style="color: #F44336; margin-bottom: 10px;">Validation Error!</h3>
          <p style="color: #666;">Please provide both quantity and unit for your product.</p>
        </div>
      `);
      setUploading(false);
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('aadhaar', currentUser.aadhaar);
    uploadFormData.append('name', formData.name);
    uploadFormData.append('price', formData.price);
    uploadFormData.append('quantity', formData.quantity);
    uploadFormData.append('unit', formData.unit); // Send unit separately
    uploadFormData.append('description', formData.description);
    uploadFormData.append('location', formData.location);
    uploadFormData.append('contactNumber', formData.contactNumber);
    uploadFormData.append('category', formData.category);
    if (formData.image) {
      uploadFormData.append('image', formData.image);
    }

    try {
      const res = await fetch('http://localhost:5000/api/products/upload', {
        method: 'POST',
        body: uploadFormData
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(`
          <div class="card" style="margin-top: 20px; text-align: center; padding: 20px; background: rgba(76, 175, 80, 0.05); border: 2px solid #4CAF50;">
            <div style="background: #4CAF50; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; color: white; font-size: 1.5rem;">
              <i class="fas fa-check"></i>
            </div>
            <h3 style="color: #4CAF50; margin-bottom: 10px;">Product Uploaded Successfully!</h3>
            <p style="color: #666;">${data.message || 'Your product has been added to the marketplace.'}</p>
          </div>
        `);
        
        // Reset form
        setFormData({
          name: '',
          price: '',
          quantity: '',
          unit: 'kg',
          description: '',
          location: '',
          contactNumber: '',
          image: null,
          category: ''
        });
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';

        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        throw new Error(data.message || data.error || 'Upload failed');
      }
    } catch (error) {
      setResponse(`
        <div class="card" style="margin-top: 20px; text-align: center; padding: 20px; background: rgba(244, 67, 54, 0.05); border: 2px solid #F44336;">
          <div style="background: #F44336; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; color: white; font-size: 1.5rem;">
            <i class="fas fa-times"></i>
          </div>
          <h3 style="color: #F44336; margin-bottom: 10px;">Upload Failed!</h3>
          <p style="color: #666;">${(error as Error).message || 'Please check your connection and try again.'}</p>
        </div>
      `);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="tab-content active">
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Upload size={20} />
            Upload Agricultural Product
          </div>
          <p style={{ color: '#666', marginTop: '10px', fontSize: '0.9rem' }}>
            List your farm produce directly to buyers across India
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Aadhaar Number</label>
              <input
                type="text"
                className="form-input"
                value={currentUser.aadhaar}
                readOnly
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Product Category</label>
              <select
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {productCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g., Organic Wheat, Alphonso Mango"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                name="price"
                className="form-input"
                placeholder="Enter price per unit"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Available Quantity</span>
              <button 
                type="button" 
                className="info-btn"
                onClick={() => setShowUnitInfo(!showUnitInfo)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Info size={14} />
              </button>
            </label>
            
            {showUnitInfo && (
              <div style={{ 
                padding: '12px', 
                marginBottom: '15px', 
                background: 'rgba(76, 175, 80, 0.05)', 
                borderRadius: '8px',
                fontSize: '0.85rem'
              }}>
                <strong>Common Indian Agricultural Units:</strong>
                <ul style={{ margin: '8px 0 0 20px', color: '#555' }}>
                  <li><strong>Quintal</strong> = 100 kg (common for grains)</li>
                  <li><strong>Ton</strong> = 1000 kg (for large quantities)</li>
                  <li><strong>Bag</strong> = Varies by crop (approx 50-75kg)</li>
                  <li><strong>Sack</strong> = Approximately 50 kg</li>
                </ul>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="number"
                name="quantity"
                className="form-input"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                style={{ flex: 2 }}
                required
                min="0"
                step="0.01"
              />
              <select
                name="unit"
                className="form-input"
                value={formData.unit}
                onChange={handleInputChange}
                style={{ flex: 1 }}
                required
              >
                {agriculturalUnits.map(unit => (
                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Product Image</label>
            <div style={{ 
              border: '2px dashed #ccc', 
              padding: '20px', 
              textAlign: 'center', 
              borderRadius: '8px',
              background: formData.image ? 'rgba(76, 175, 80, 0.05)' : '#f9f9f9'
            }}>
              <input
                type="file"
                name="image"
                id="product-image"
                className="form-input"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                required
              />
              <label htmlFor="product-image" style={{ cursor: 'pointer' }}>
                <CloudUpload size={32} color="#666" style={{ marginBottom: '10px' }} />
                <div style={{ color: '#666' }}>
                  {formData.image ? formData.image.name : 'Click to upload product image'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>
                  Recommended: Clear images of your produce (max 5MB)
                </div>
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              className="form-input"
              placeholder="Enter WhatsApp number for buyers"
              value={formData.contactNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Product Description</label>
            <textarea
              name="description"
              className="form-input"
              placeholder="Describe your product (quality, variety, harvesting time, organic certification, etc.)"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="Enter your village/town, district, state"
                value={formData.location}
                onChange={handleInputChange}
                style={{ flex: 1 }}
                required
              />
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={getCurrentLocation}
                style={{ whiteSpace: 'nowrap' }}
              >
                <MapPin size={16} />
                My Location
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={uploading}
            style={{ width: '100%', marginTop: '15px' }}
          >
            <CloudUpload size={16} />
            {uploading ? 'Uploading Product...' : 'List My Product'}
          </button>
        </form>
        
        {response && (
          <div dangerouslySetInnerHTML={{ __html: response }} />
        )}
      </div>

      {/* Information Card */}
      <div className="card" style={{ background: 'rgba(76, 175, 80, 0.05)', marginTop: '20px' }}>
        <h3 style={{ color: '#2E7D32', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Info size={20} />
          Tips for Successful Listings
        </h3>
        <ul style={{ marginLeft: '20px', color: '#555' }}>
          <li>Use clear, well-lit photos of your actual produce</li>
          <li>Mention if your products are organic or pesticide-free</li>
          <li>Specify accurate quantities and harvest dates</li>
          <li>Include your preferred contact method and response time</li>
          <li>Set competitive prices based on current market rates</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductUpload;