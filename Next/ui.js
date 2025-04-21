export class UIController {
    constructor(logger, progressManager) {
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');
        this.statusText = document.getElementById('status-text');
        this.statusLight = document.getElementById('status-light');
        this.questionSummary = document.getElementById('question-summary');
        this.generatedDocument = document.getElementById('generated-document');
        
        this.logger = logger;
        this.progressManager = progressManager;
        
        this.setupEventListeners();
        this.setupProgressUI();
        this.setupLogUI();
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleSend());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });
    }

    setupProgressUI() {
        const progressSteps = document.getElementById('progress-steps');
        this.progressManager.addListener(steps => {
            progressSteps.innerHTML = '';
            steps.forEach(step => {
                const stepElement = document.createElement('div');
                stepElement.className = 'progress-step';
                stepElement.innerHTML = `
                    <div class="step-status status-${step.status}"></div>
                    <div class="step-name">${step.name}</div>
                    ${step.progress ? `<div class="step-progress">${step.progress}%</div>` : ''}
                `;
                progressSteps.appendChild(stepElement);
            });
        });
    }

    setupLogUI() {
        const logEntries = document.getElementById('log-entries');
        this.logger.addListener(logEntry => {
            const entry = document.createElement('div');
            entry.className = `log-entry log-${logEntry.level}`;
            entry.textContent = `[${logEntry.timestamp.toLocaleTimeString()}] ${logEntry.message}`;
            logEntries.appendChild(entry);
            logEntries.scrollTop = logEntries.scrollHeight;
        });
    }

    setOnSendCallback(callback) {
        this.onSendCallback = callback;
    }

    async handleSend() {
        const message = this.userInput.value.trim();
        if (message) {
            this.logger.info('ユーザーメッセージを送信中', { message });
            this.addUserMessage(message);
            this.userInput.value = '';
            this.setStatus('処理中...', 'processing');
            
            if (this.onSendCallback) {
                await this.onSendCallback(message);
            }
        }
    }

    addUserMessage(message) {
        const messageElement = this.createMessageElement(message, 'user-message');
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    addAIMessage(message) {
        const messageElement = this.createMessageElement(message, 'ai-message');
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    createMessageElement(message, className) {
        const div = document.createElement('div');
        div.className = `message ${className}`;
        div.textContent = message;
        return div;
    }

    updateSummary(summary) {
        this.questionSummary.textContent = summary;
    }

    updateDocument(document) {
        this.generatedDocument.textContent = document;
    }

    setStatus(text, state = 'ready') {
        this.statusText.textContent = text;
        switch (state) {
            case 'ready':
                this.statusLight.style.backgroundColor = 'var(--success-color)';
                break;
            case 'processing':
                this.statusLight.style.backgroundColor = 'var(--primary-color)';
                break;
            case 'error':
                this.statusLight.style.backgroundColor = 'var(--error-color)';
                break;
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    disableInput() {
        this.userInput.disabled = true;
        this.sendButton.disabled = true;
    }

    enableInput() {
        this.userInput.disabled = false;
        this.sendButton.disabled = false;
    }
}