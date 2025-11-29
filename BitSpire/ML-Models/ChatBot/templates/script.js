document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Function to escape HTML for user messages
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Function to add a message to the chat display
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        if (sender === 'bot') {
            // Use marked (markdown -> HTML) if available, otherwise fall back to plain text
            if (window.marked) {
                messageDiv.innerHTML = window.marked.parse(text || '');
            } else {
                messageDiv.innerHTML = `<p>${escapeHtml(text || '')}</p>`;
            }
        } else {
            // user message should be escaped
            messageDiv.innerHTML = `<p>${escapeHtml(text)}</p>`;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to send message to the backend
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        addMessage(message, 'user');
        userInput.value = ''; // Clear input
        sendButton.disabled = true;

        try {
            const response = await fetch('/chat', { // relative URL is better (avoids CORS issues while developing)
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.response) {
                addMessage(data.response, 'bot');
            } else if (data.error) {
                addMessage(`Error: ${data.error}`, 'bot');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            addMessage('Oops! Something went wrong. Please try again later.', 'bot');
        } finally {
            sendButton.disabled = false;
            userInput.focus();
        }
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
});
