import React from 'react';
import { 
  BarChart3, 
  HandCoins, 
  Package, 
  Upload, 
  ShoppingCart, 
  Brain, 
  Bot,
  Leaf,
  Home,
  DollarSign,
  ShoppingBag
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser?: { name: string; aadhaar: string; [key: string]: any } | null;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, currentUser }) => {
  const openSubsidyWorkflow = () => {
    console.log('Opening subsidy workflow with user data:', currentUser);
    
    if (currentUser) {
      // Create URL with farmer data as parameters (encoded for security)
      const subsidyUrl = new URL('https://farmer-subsidy-livid.vercel.app/');
      subsidyUrl.searchParams.set('name', encodeURIComponent(currentUser.name || ''));
      subsidyUrl.searchParams.set('aadhaar', encodeURIComponent(currentUser.aadhaar || ''));
      subsidyUrl.searchParams.set('landArea', encodeURIComponent(currentUser.landSize?.toString() || '0'));
      subsidyUrl.searchParams.set('cropType', encodeURIComponent(currentUser.cropType || 'wheat'));
      
      console.log('Opening subsidy with URL:', subsidyUrl.toString());
      
      // Open subsidy in same tab to preserve sessionStorage
      window.location.href = subsidyUrl.toString();
    } else {
      console.error('No current user data available');
      window.location.href = 'https://farmer-subsidy-livid.vercel.app/';
    }
  };
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'upload', label: 'Upload Product', icon: Upload },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
    { id: 'subsidy', label: 'Schemes', icon: HandCoins },
    { id: 'ai-schemes', label: 'AI Recommendations', icon: Brain },
    { id: 'orders-revenue', label: 'Orders & Revenue', icon: DollarSign },
  ];

  return (
    <nav className="nav-tabs">
      <div className="nav-tabs-inner">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <IconComponent size={16} />
              {item.label}
            </button>
          );
        })}

        <button
          className="nav-tab"
          onClick={openSubsidyWorkflow}
        >
          <Leaf size={16} />
          Farmer Subsidy
        </button>
        
        <button
          className="nav-tab"
          onClick={() => window.location.href = 'https://nishant-gpt-3.vercel.app/'}
        >
          <Bot size={16} />
          AI Chatbot
        </button>
      </div>
    </nav>
  );
};

export default Navigation;