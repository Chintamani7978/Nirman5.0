/* mock data used by pages (same as your React mockData) */

window.AGRI = (function(){
  const VEGETABLE_PRICES = [
    { name: "Tomato", today: 45, yesterday: 40, unit: "kg" },
    { name: "Onion", today: 30, yesterday: 35, unit: "kg" },
    { name: "Potato", today: 25, yesterday: 22, unit: "kg" },
    { name: "Spinach", today: 15, yesterday: 15, unit: "bunch" },
    { name: "Carrot", today: 50, yesterday: 48, unit: "kg" },
  ];

  const MARKETPLACE_LISTINGS = [
    { id:1, crop:"Organic Wheat", price:2200, unit:"quintal", quantity:50, location:"Punjab, India", grade:"A+", farmer:"Rajesh Kumar", image:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=1200" },
    { id:2, crop:"Fresh Tomatoes", price:40, unit:"kg", quantity:200, location:"Nashik, Maharashtra", grade:"A", farmer:"Suresh Patil", image:"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=1200" },
    { id:3, crop:"Basmati Rice", price:4500, unit:"quintal", quantity:100, location:"Haryana, India", grade:"Premium", farmer:"Amit Singh", image:"https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1200" },
    { id:4, crop:"Red Onions", price:28, unit:"kg", quantity:500, location:"Madhya Pradesh", grade:"B+", farmer:"Vikram Yadav", image:"https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=1200" }
  ];

  const COMMUNITY_POSTS = [
    { id:1, user:"Ramesh Farmer", avatar:"https://i.pravatar.cc/150?u=ramesh", image:"https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1200", caption:"Successfully harvested the new batch of organic wheat! 🌾", likes:124, time:"2 hours ago" },
    { id:2, user:"Green Earth Co-op", avatar:"https://i.pravatar.cc/150?u=green", image:"https://images.unsplash.com/photo-1595855793915-633ba13f320f?auto=format&fit=crop&q=80&w=1200", caption:"Community meeting today discussing irrigation methods.", likes:89, time:"5 hours ago" },
    { id:3, user:"Priya Singh", avatar:"https://i.pravatar.cc/150?u=priya", image:"https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1200", caption:"Look at these beautiful sunflowers! 🌻", likes:256, time:"1 day ago" }
  ];

  const LEARNING_MODULES = [
    { id:1, title:"Organic Farming Basics", category:"Beginner", description:"Learn fundamentals of chemical-free farming and soil health."},
    { id:2, title:"Government Schemes 2025", category:"Policy", description:"Latest subsidies and support programs."},
    { id:3, title:"Modern Irrigation", category:"Technology", description:"Drip irrigation and sprinkler systems."},
    { id:4, title:"Crop Grading & Packaging", category:"Business", description:"How to grade produce for better prices."}
  ];

  const CHAT_RESPONSES = {
    default: "I can help you with pest diagnosis, crop advisory, farming tips, and seasonal planning. What do you need help with today?",
    pest: "For pest control, try Neem oil spray (5ml/liter) as an organic solution.",
    crop: "Wheat and Mustard are good options depending on soil moisture. Have you tested your soil recently?",
    price: "Check the Mandi Prices Today section for current rates."
  };

  return {
    VEGETABLE_PRICES,
    MARKETPLACE_LISTINGS,
    COMMUNITY_POSTS,
    LEARNING_MODULES,
    CHAT_RESPONSES
  };
})();
