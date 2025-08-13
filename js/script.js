document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const sendButton = document.getElementById('send-button');
    const clearChatButton = document.getElementById('clear-chat');
    const typingIndicator = document.getElementById('typing-indicator-container');

    // --- API Configuration ---
    const GEMINI_API_KEY = "AIzaSyBL0dBQLDIU_rFZYNGfek53FK0L5Lk7I0o";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const SYSTEM_INSTRUCTION = `You are a helpful Data Structures and Algorithms (DSA) Instructor. You will give a simple and brief explanation of any topic related to data structures and algorithms, optionally with concise examples or code snippets in javascript. If a user asks a question outside of DSA, politely respond: "I am not able to answer this question, I can only answer questions related to data structures and algorithms." If a user greets you with hello, hi, or how are you?, reply with: Hii, how can I help you?. Keep all answers short, clear, and beginner-friendly. When providing code, wrap it in Markdown code blocks.`;

    // --- Event Listeners ---
    chatForm.addEventListener('submit', handleChatSubmit);
    userInput.addEventListener('keydown', handleInputKeydown);
    clearChatButton.addEventListener('click', clearChat);
    chatBox.addEventListener('click', handleChatBoxClick);

    // --- Functions ---

    /**
     * Handles the submission of the chat form.
     * @param {Event} e The form submission event.
     */
    async function handleChatSubmit(e) {
        e.preventDefault();
        const userMessage = userInput.value.trim();
        if (userMessage === '' || sendButton.disabled) return;

        addMessageToChatBox('You', userMessage);
        userInput.value = '';
        toggleLoadingState(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "contents": [{ "parts": [{ "text": userMessage }] }],
                    "systemInstruction": { "parts": { "text": SYSTEM_INSTRUCTION } }
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();
            const aiMessage = responseData.candidates[0].content.parts[0].text;
            addMessageToChatBox('AI', aiMessage);

        } catch (error) {
            console.error("Error fetching from Gemini API:", error);
            addMessageToChatBox('AI', 'Sorry, I encountered an error. Please check the console or try again.');
        } finally {
            toggleLoadingState(false);
        }
    }

    /**
     * Toggles the loading state of the UI.
     * @param {boolean} isLoading - Whether the app is in a loading state.
     */
    function toggleLoadingState(isLoading) {
        sendButton.disabled = isLoading;
        userInput.disabled = isLoading;
        typingIndicator.style.display = isLoading ? 'block' : 'none';
        if(isLoading) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    /**
     * Adds a message to the chat box and formats it.
     * @param {string} sender - The sender of the message ('You' or 'AI').
     * @param {string} message - The message content.
     */
    function addMessageToChatBox(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender.toLowerCase()}-message`);

        const formattedMessage = (sender === 'AI') ? formatAIResponse(message) : message;

        messageElement.innerHTML = `
            <span class="message-sender">${sender}</span>
            <div class="message-bubble">
                <div class="message-content">${formattedMessage}</div>
            </div>
        `;
        
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    /**
     * Formats the AI's response, converting Markdown code blocks to styled HTML.
     * @param {string} responseText - The raw text from the AI.
     * @returns {string} - HTML-formatted string.
     */
    function formatAIResponse(responseText) {
        // Convert Markdown code blocks to <pre><code> with a copy button
        const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
        return responseText.replace(codeBlockRegex, (match, lang, code) => {
            const escapedCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            return `<pre><button class="copy-code-btn" title="Copy code">Copy</button><code class="language-${lang}">${escapedCode}</code></pre>`;
        });
    }

    /**
     * Clears all messages from the chat box.
     */
    function clearChat() {
        chatBox.innerHTML = `
            <div class="chat-message ai-message">
                <span class="message-sender">AI</span>
                <div class="message-bubble">
                     <div class="message-content">Hii, how can I help you with Data Structures and Algorithms today?</div>
                </div>
            </div>
        `;
        userInput.focus();
    }
    
    /**
     * Handles keydown events on the input field (e.g., 'Enter' to send).
     * @param {KeyboardEvent} e - The keyboard event.
     */
    function handleInputKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    }

    /**
     * Handles clicks within the chat box, specifically for the copy button.
     * @param {MouseEvent} e - The click event.
     */
    function handleChatBoxClick(e) {
        if (e.target.classList.contains('copy-code-btn')) {
            const pre = e.target.closest('pre');
            const code = pre.querySelector('code').innerText;
            navigator.clipboard.writeText(code).then(() => {
                e.target.textContent = 'Copied!';
                setTimeout(() => {
                    e.target.textContent = 'Copy';
                }, 2000);
            });
        }
    }
});