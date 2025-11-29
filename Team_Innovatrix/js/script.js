function handleScrollReveal() {
    const trigger = window.innerHeight * 0.85;
    const selectors = ['.card', '.post', '.member', '.testimonial'];
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            if (el.getBoundingClientRect().top < trigger) el.classList.add('show');
        });
    });
}

function initMenuToggle() {
    const menuBtn = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.navbar ul');
    if (!menuBtn || !navList) return;
    menuBtn.addEventListener('click', () => {
        const isVisible = navList.style.display === 'flex' || navList.classList.contains('active');
        if (isVisible) {
            navList.style.display = 'none';
            navList.classList.remove('active');
        } else {
            navList.style.display = 'flex';
            navList.classList.add('active');
            navList.style.flexDirection = 'column';
        }
    });
}

function initChatbotToggle() {
    const icon = document.getElementById('chatbot-icon');
    const popup = document.getElementById('chatbot-popup');
    if (!icon || !popup) return;
    icon.addEventListener('click', () => {
        popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';
    });
}

function initStoryForm() {
    const storyForm = document.getElementById('storyForm');
    if (!storyForm) return;
    storyForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const ta = this.querySelector('textarea');
        if (!ta) return;
        const storyText = ta.value.trim();
        if (!storyText) return alert('Please write something before submitting.');
        const storyList = document.getElementById('story-list');
        const card = document.createElement('div');
        card.className = 'story-card';
        card.innerHTML = `<strong>Anonymous</strong><p>${escapeHtml(storyText)}</p>`;
        if (storyList) storyList.prepend(card);
        this.reset();
    });
}

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', () => {
    initMenuToggle();
    initChatbotToggle();
    initStoryForm();
    handleScrollReveal();
});

window.addEventListener('scroll', handleScrollReveal);