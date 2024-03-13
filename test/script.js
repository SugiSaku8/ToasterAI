document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('message-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    messageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const message = userInput.value.trim();
        if (message) {
            sendMessageToModel(message);
            userInput.value = '';
        }
    });

    function sendMessageToModel(message) {
        fetch('https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer YOUR_HUGGING_FACE_API_TOKEN',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: message
            })
        })
        .then(response => response.json())
        .then(data => {
            displayMessage(data.generated_text, 'bot');
        })
        .catch(error => console.error('Error:', error));
    }

    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
