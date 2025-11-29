/* script.js
   Shared scripts for navigation, pages and chatbot.
*/

(function(){
  // helper to set active nav link
  function setActiveNav(){
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(a=>{
      const href = a.getAttribute('href') || '';
      if(href.endsWith(path) || (href === 'index.html' && path === 'index.html')) {
        a.classList.add('active');
      } else a.classList.remove('active');
    });
  }
  // run on load
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();

  function init(){
    setActiveNav();
    attachChatbot();
    attachThemeToggle();
    runPageScripts();
    // smooth anchor
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', e=>{
        e.preventDefault();
        document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'});
      });
    });
  }

  // Attach theme toggle behavior
  function attachThemeToggle(){
    const toggle = document.getElementById('theme-toggle');
    if(!toggle) return;

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleIcon(savedTheme);

    toggle.addEventListener('click', ()=>{
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateToggleIcon(newTheme);
    });
  }

  function updateToggleIcon(theme){
    const toggle = document.getElementById('theme-toggle');
    if(!toggle) return;
    toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // Attach chatbot behavior
  function attachChatbot(){
    const chatBtn = document.getElementById('chat-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');

    if(!chatBtn || !chatWindow) return;

    chatBtn.addEventListener('click', ()=> chatWindow.style.display = 'flex');
    chatClose.addEventListener('click', ()=> chatWindow.style.display = 'none');
    chatSend && chatSend.addEventListener('click', sendMessage);
    chatInput && chatInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') sendMessage(); });

    // preload bot greeting
    appendBot("Namaste! I am Arnak, your AI farming assistant. How can I help you today?");
    function appendBot(text){
      if(!chatBody) return;
      const d = document.createElement('div'); d.className='bot-msg'; d.textContent = text;
      chatBody.appendChild(d); chatBody.scrollTop = chatBody.scrollHeight;
    }
    function appendUser(text){
      if(!chatBody) return;
      const d = document.createElement('div'); d.className='user-msg'; d.textContent = text;
      chatBody.appendChild(d); chatBody.scrollTop = chatBody.scrollHeight;
    }

    function sendMessage(){
      const v = chatInput.value && chatInput.value.trim();
      if(!v) return;
      appendUser(v);
      chatInput.value = '';
      // simulate thinking
      const loading = document.createElement('div'); loading.className = 'bot-msg'; loading.textContent='Typing...'; chatBody.appendChild(loading); chatBody.scrollTop = chatBody.scrollHeight;
      setTimeout(()=>{
        loading.remove();
        const lower = v.toLowerCase();
        let res = window.AGRI.CHAT_RESPONSES.default;
        if(lower.includes('pest')||lower.includes('insect')||lower.includes('bug')) res = window.AGRI.CHAT_RESPONSES.pest;
        else if(lower.includes('crop')||lower.includes('plant')||lower.includes('sow')) res = window.AGRI.CHAT_RESPONSES.crop;
        else if(lower.includes('price')||lower.includes('rate')||lower.includes('cost')) res = window.AGRI.CHAT_RESPONSES.price;
        appendBot(res);
      }, 900);
    }
  }

  // Page-specific scripts (chart placeholders, lists)
  function runPageScripts(){
    const page = location.pathname.split('/').pop() || 'index.html';
    if(page === '' || page === 'index.html'){
      renderPriceToday();
      renderCommunityTeasers();
    }
    if(page === 'marketplace.html'){
      renderMarketplace();
      attachSearchMarketplace();
    }
    if(page === 'community.html'){
      renderCommunityFeed();
      attachCreatePost();
    }
    if(page === 'learning.html'){
      renderLearning();
    }
    if(page === 'mandi.html'){
      attachMandiSearch();
    }
    if(page === 'auth.html'){
      attachAuthForm();
    }
  }

  /* Home: Price Today */
  function renderPriceToday(){
    const container = document.getElementById('price-container');
    if(!container) return;
    container.innerHTML = '';
    window.AGRI.VEGETABLE_PRICES.forEach(item=>{
      const diff = item.today - item.yesterday;
      const up = diff > 0;
      const itemEl = document.createElement('div'); itemEl.className = 'price-item card';
      itemEl.innerHTML = `
        <div class="meta">
          <div class="letter">${item.name[0]}</div>
          <div>
            <div style="font-weight:700">${item.name}</div>
            <div style="font-size:13px;color:var(--muted)">per ${item.unit}</div>
          </div>
        </div>
        <div class="right">
          <div style="font-weight:800;color:var(--primary)">₹${item.today}</div>
          <div style="font-size:13px;color:${up?'#dc2626':'#059669'}">${up?'+':''}${diff} from yest.</div>
        </div>
      `;
      container.appendChild(itemEl);
    });

    // simple chart placeholder (bar heights)
    const chart = document.getElementById('price-chart');
    if(chart){
      chart.innerHTML = '';
      const max = Math.max(...window.AGRI.VEGETABLE_PRICES.map(p=>p.today));
      window.AGRI.VEGETABLE_PRICES.forEach(p=>{
        const bar = document.createElement('div'); 
        bar.style.width='18%'; bar.style.margin='0 1%'; bar.style.display='inline-block'; bar.style.verticalAlign='bottom';
        const inner = document.createElement('div'); inner.style.height = (p.today/max*220)+'px'; inner.style.background = 'linear-gradient(180deg, var(--primary), #2ba14a)'; inner.style.borderRadius='6px';
        bar.appendChild(inner); chart.appendChild(bar);
      });
    }
  }

  /* Home: Community teasers */
  function renderCommunityTeasers(){
    const cont = document.getElementById('community-teasers');
    if(!cont) return;
    cont.innerHTML = '';
    window.AGRI.COMMUNITY_POSTS.slice(0,3).forEach(post=>{
      const el = document.createElement('div'); el.className='post card';
      el.innerHTML = `
        <div class="post-header">
          <div class="avatar"><img src="${post.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:999px" /></div>
          <div>
            <div style="font-weight:700">${post.user}</div>
            <div style="font-size:12px;color:var(--muted)">${post.time}</div>
          </div>
        </div>
        <img class="post-image" src="${post.image}" alt="post" />
        <div class="post-body">
          <div style="font-weight:700;margin-bottom:6px">${post.likes} likes</div>
          <div style="font-size:14px">${post.caption}</div>
        </div>
      `;
      cont.appendChild(el);
    });
  }

  /* Marketplace */
  function renderMarketplace(){
    const grid = document.getElementById('market-grid');
    if(!grid) return;
    grid.innerHTML = '';
    window.AGRI.MARKETPLACE_LISTINGS.forEach(item=>{
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `
        <div style="position:relative;overflow:hidden;border-radius:10px;height:160px">
          <img src="${item.image}" style="width:100%;height:100%;object-fit:cover" />
          <div style="position:absolute;right:10px;top:10px;background:rgba(255,255,255,0.9);padding:6px 8px;border-radius:8px;font-weight:700">${item.grade}</div>
        </div>
        <div style="padding-top:12px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <div style="font-weight:800">${item.crop}</div>
              <div style="font-size:13px;color:var(--muted)">${item.location}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:900;color:var(--primary)">₹${item.price}</div>
              <div style="font-size:13px;color:var(--muted)">${item.quantity} ${item.unit}</div>
            </div>
          </div>
          <div style="margin-top:10px;display:flex;gap:8px">
            <button class="btn" style="background:#f3f4f6;border-radius:8px;border:1px solid rgba(15,23,42,0.04)">View</button>
            <button class="btn" style="background:var(--primary);color:white;border-radius:8px">Buy Now</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function attachSearchMarketplace(){
    const form = document.getElementById('market-search-form');
    if(!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const q = (document.getElementById('market-search')||{}).value.toLowerCase();
      const grid = document.getElementById('market-grid');
      grid.innerHTML = '';
      const list = window.AGRI.MARKETPLACE_LISTINGS.filter(item=> item.crop.toLowerCase().includes(q) || item.location.toLowerCase().includes(q));
      (list.length?list:window.AGRI.MARKETPLACE_LISTINGS).forEach(item=>{
        const card = document.createElement('div'); card.className='card';
        card.innerHTML = `
          <div style="position:relative;overflow:hidden;border-radius:10px;height:160px">
            <img src="${item.image}" style="width:100%;height:100%;object-fit:cover" />
            <div style="position:absolute;right:10px;top:10px;background:rgba(255,255,255,0.9);padding:6px 8px;border-radius:8px;font-weight:700">${item.grade}</div>
          </div>
          <div style="padding-top:12px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div>
                <div style="font-weight:800">${item.crop}</div>
                <div style="font-size:13px;color:var(--muted)">${item.location}</div>
              </div>
              <div style="text-align:right">
                <div style="font-weight:900;color:var(--primary)">₹${item.price}</div>
                <div style="font-size:13px;color:var(--muted)">${item.quantity} ${item.unit}</div>
              </div>
            </div>
            <div style="margin-top:10px;display:flex;gap:8px">
              <button class="btn" style="background:#f3f4f6;border-radius:8px;border:1px solid rgba(15,23,42,0.04)">View</button>
              <button class="btn" style="background:var(--primary);color:white;border-radius:8px">Buy Now</button>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });
    });
  }

  /* Community feed */
  function renderCommunityFeed(){
    const grid = document.getElementById('community-grid');
    if(!grid) return;
    grid.innerHTML = '';
    window.AGRI.COMMUNITY_POSTS.forEach(post=>{
      const card = document.createElement('div'); card.className='post';
      card.innerHTML = `
        <div class="post-header">
          <div class="avatar"><img src="${post.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:999px" /></div>
          <div>
            <div style="font-weight:700">${post.user}</div>
            <div style="font-size:12px;color:var(--muted)">${post.time}</div>
          </div>
        </div>
        <img class="post-image" src="${post.image}" />
        <div class="post-body">
          <div style="display:flex;gap:10px;margin-bottom:8px">
            <button class="btn" style="background:transparent">♡</button>
            <button class="btn" style="background:transparent">💬</button>
            <button class="btn" style="background:transparent">↗</button>
          </div>
          <div style="font-weight:700">${post.likes} likes</div>
          <div style="margin-top:8px">${post.caption}</div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function attachCreatePost(){
    const form = document.getElementById('post-form');
    if(!form) return;
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const txt = (document.getElementById('post-text')||{}).value;
      if(!txt) return alert('Write something!');
      // naive add to top
      const newPost = { id:Date.now(), user:'You', avatar:'https://i.pravatar.cc/150?u=you', image:'https://images.unsplash.com/photo-1544947320-23b0f2d46cda?auto=format&fit=crop&q=80&w=1200', caption:txt, likes:0, time:'Just now' };
      window.AGRI.COMMUNITY_POSTS.unshift(newPost);
      renderCommunityFeed();
      form.reset();
      alert('Posted (local only)');
    });
  }

  /* Learning hub */
  function renderLearning(){
    const grid = document.getElementById('learning-grid');
    if(!grid) return;
    grid.innerHTML = '';
    window.AGRI.LEARNING_MODULES.forEach(m=>{
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
          <div style="width:44px;height:44px;border-radius:10px;background:var(--primary);display:flex;align-items:center;justify-content:center;color:white;font-weight:700">${m.category[0]}</div>
          <div>
            <div style="font-size:13px;font-weight:800">${m.title}</div>
            <div style="font-size:12px;color:var(--muted)">${m.category}</div>
          </div>
        </div>
        <div style="margin-top:8px">${m.description}</div>
        <div style="margin-top:12px"><button class="btn" style="background:transparent;border:1px solid rgba(15,23,42,0.05);border-radius:10px;padding:8px 12px">Start Learning</button></div>
      `;
      grid.appendChild(card);
    });
  }

  /* Mandi locator */
  function attachMandiSearch(){
    const f = document.getElementById('mandi-form');
    if(!f) return;
    f.addEventListener('submit', e=>{
      e.preventDefault();
      const q = (document.getElementById('mandi-q')||{}).value;
      if(!q) return alert('Enter location (city or village)');
      const url = `https://www.openstreetmap.org/search?query=${encodeURIComponent(q+' mandi')}`;
      window.open(url,'_blank');
    });
  }

  /* Auth */
  function attachAuthForm(){
    const f = document.getElementById('auth-form');
    if(!f) return;
    
    // Attach role toggle functionality
    attachRoleToggle();
    
    f.addEventListener('submit', e=>{
      e.preventDefault();
      const email = (document.getElementById('auth-email')||{}).value;
      const password = (document.getElementById('auth-password')||{}).value;
      const role = document.getElementById('auth-card')?.getAttribute('data-role') || 'farmer';
      
      if(!email) return alert('Enter email');
      if(!password) return alert('Enter password');
      
      // Demo login flow
      alert(`Login successful as ${role}! Redirecting to home...`);
      setTimeout(()=> location.href = 'index.html', 1000);
    });
    
    // Handle create account button
    const createAccountBtn = document.querySelector('.create-account-btn');
    if(createAccountBtn){
      createAccountBtn.addEventListener('click', ()=>{
        openCreateAccountModal();
      });
    }
    
    // Attach create account modal functionality
    attachCreateAccountModal();
    
    // Handle Google login
    const googleBtn = document.querySelector('.google-btn');
    if(googleBtn){
      googleBtn.addEventListener('click', ()=>{
        const role = document.getElementById('auth-card')?.getAttribute('data-role') || 'farmer';
        alert(`Sign in with Google as ${role} (demo). This would initiate Google OAuth.`);
      });
    }
  }
  
  function attachRoleToggle(){
    const authCard = document.getElementById('auth-card');
    const farmerBtn = document.getElementById('farmer-btn');
    const customerBtn = document.getElementById('customer-btn');
    
    if(!authCard || !farmerBtn || !customerBtn) return;
    
    // Set default role to farmer
    authCard.setAttribute('data-role', 'farmer');
    
    farmerBtn.addEventListener('click', ()=>{
      authCard.setAttribute('data-role', 'farmer');
      farmerBtn.classList.add('active');
      customerBtn.classList.remove('active');
    });
    
    customerBtn.addEventListener('click', ()=>{
      authCard.setAttribute('data-role', 'customer');
      customerBtn.classList.add('active');
      farmerBtn.classList.remove('active');
    });
  }
  
  function openCreateAccountModal(){
    const modal = document.getElementById('create-account-modal');
    const createCard = document.getElementById('create-account-card');
    const authCard = document.getElementById('auth-card');
    
    if(!modal || !createCard) return;
    
    // Set initial role from login page
    const currentRole = authCard?.getAttribute('data-role') || 'farmer';
    createCard.setAttribute('data-role', currentRole);
    
    // Set radio button based on current role
    const joinFarmer = document.getElementById('join-farmer');
    const joinCustomer = document.getElementById('join-customer');
    if(currentRole === 'farmer' && joinFarmer) joinFarmer.checked = true;
    if(currentRole === 'customer' && joinCustomer) joinCustomer.checked = true;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  
  function closeCreateAccountModal(){
    const modal = document.getElementById('create-account-modal');
    if(!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Reset form
    const form = document.getElementById('create-account-form');
    if(form) form.reset();
    
    // Reset photo preview
    const photoPreview = document.getElementById('photo-preview');
    const photoPlaceholder = document.getElementById('photo-placeholder');
    if(photoPreview) photoPreview.style.display = 'none';
    if(photoPlaceholder) photoPlaceholder.style.display = 'block';
    
    // Hide OTP section
    const otpSection = document.getElementById('otp-section');
    if(otpSection) otpSection.style.display = 'none';
  }
  
  function attachCreateAccountModal(){
    const modal = document.getElementById('create-account-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('cancel-create');
    const createCard = document.getElementById('create-account-card');
    const form = document.getElementById('create-account-form');
    const photoInput = document.getElementById('photo-input');
    const sendOtpBtn = document.getElementById('send-otp-btn');
    const joinFarmer = document.getElementById('join-farmer');
    const joinCustomer = document.getElementById('join-customer');
    const createPassword = document.getElementById('create-password');
    const reenterPassword = document.getElementById('reenter-password');
    const passwordMatch = document.getElementById('password-match');
    
    if(!modal) return;
    
    // Close modal handlers
    if(modalOverlay) modalOverlay.addEventListener('click', closeCreateAccountModal);
    if(modalClose) modalClose.addEventListener('click', closeCreateAccountModal);
    if(cancelBtn) cancelBtn.addEventListener('click', closeCreateAccountModal);
    
    // Role switching in modal
    if(joinFarmer){
      joinFarmer.addEventListener('change', ()=>{
        if(joinFarmer.checked && createCard){
          createCard.setAttribute('data-role', 'farmer');
        }
      });
    }
    
    if(joinCustomer){
      joinCustomer.addEventListener('change', ()=>{
        if(joinCustomer.checked && createCard){
          createCard.setAttribute('data-role', 'customer');
        }
      });
    }
    
    // Photo upload preview
    if(photoInput){
      photoInput.addEventListener('change', (e)=>{
        const file = e.target.files[0];
        if(file){
          const reader = new FileReader();
          reader.onload = (e)=>{
            const photoPreview = document.getElementById('photo-preview');
            const photoPlaceholder = document.getElementById('photo-placeholder');
            if(photoPreview){
              photoPreview.src = e.target.result;
              photoPreview.style.display = 'block';
            }
            if(photoPlaceholder) photoPlaceholder.style.display = 'none';
          };
          reader.readAsDataURL(file);
        }
      });
    }
    
    // OTP sending
    if(sendOtpBtn){
      sendOtpBtn.addEventListener('click', ()=>{
        const emailPhone = document.getElementById('create-email-phone');
        if(!emailPhone || !emailPhone.value.trim()){
          alert('Please enter email or phone number');
          return;
        }
        
        // Disable button and show loading
        sendOtpBtn.disabled = true;
        sendOtpBtn.textContent = 'Sending...';
        
        // Simulate OTP sending
        setTimeout(()=>{
          sendOtpBtn.disabled = false;
          sendOtpBtn.textContent = 'Resend OTP';
          const otpSection = document.getElementById('otp-section');
          if(otpSection) otpSection.style.display = 'block';
          alert('OTP sent successfully! (Demo: Use 123456)');
        }, 1500);
      });
    }
    
    // Password matching validation
    if(createPassword && reenterPassword && passwordMatch){
      function checkPasswordMatch(){
        if(reenterPassword.value){
          if(createPassword.value === reenterPassword.value){
            passwordMatch.textContent = '✓ Passwords match';
            passwordMatch.className = 'match';
            passwordMatch.style.display = 'block';
          } else {
            passwordMatch.textContent = '✗ Passwords do not match';
            passwordMatch.className = 'mismatch';
            passwordMatch.style.display = 'block';
          }
        } else {
          passwordMatch.style.display = 'none';
        }
      }
      
      createPassword.addEventListener('input', checkPasswordMatch);
      reenterPassword.addEventListener('input', checkPasswordMatch);
    }
    
    // Form submission
    if(form){
      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        
        const name = document.getElementById('create-name')?.value;
        const dobDay = document.getElementById('dob-day')?.value;
        const dobMonth = document.getElementById('dob-month')?.value;
        const dobYear = document.getElementById('dob-year')?.value;
        const emailPhone = document.getElementById('create-email-phone')?.value;
        const otp = document.getElementById('create-otp')?.value;
        const password = document.getElementById('create-password')?.value;
        const reenter = document.getElementById('reenter-password')?.value;
        const role = createCard?.getAttribute('data-role') || 'farmer';
        
        // Validation
        if(!name) return alert('Please enter your name');
        if(!dobDay || !dobMonth || !dobYear) return alert('Please enter date of birth');
        if(!emailPhone) return alert('Please enter email or phone');
        if(!otp) return alert('Please enter OTP');
        if(otp !== '123456') return alert('Invalid OTP. Use 123456 for demo.');
        if(!password) return alert('Please enter password');
        if(password !== reenter) return alert('Passwords do not match');
        if(password.length < 6) return alert('Password must be at least 6 characters');
        
        // Success
        alert(`Account created successfully as ${role}! Redirecting to home...`);
        setTimeout(()=>{
          closeCreateAccountModal();
          location.href = 'index.html';
        }, 1000);
      });
    }
  }

})();
