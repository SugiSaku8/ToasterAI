import { AICoachingAPI } from './api.js';
import { UIController } from './ui.js';
import { Logger } from './logger.js';
import { ProgressManager } from './progress.js';

class AICoachingApp {
    constructor() {
        this.logger = new Logger();
        this.progressManager = new ProgressManager();
        this.api = new AICoachingAPI('YOUR_GEMINI_API_KEY');
        this.ui = new UIController(this.logger, this.progressManager);
        this.sessionId = null;
        this.setupEventHandlers();
        
        this.logger.info('AIコーチングシステムを初期化しました');
    }

    setupEventHandlers() {
        this.ui.setOnSendCallback(async (message) => {
            try {
                this.ui.disableInput();
                
                if (!this.sessionId) {
                    this.logger.info('新しいセッションを開始します');
                    this.progressManager.resetProgress();
                    
                    // 質問解析
                    this.progressManager.updateStep('question-analysis', 'processing');
                    this.logger.info('質問を解析中...');
                    const response = await this.api.startNewSession('user1', message);
                    this.progressManager.updateStep('question-analysis', 'completed');
                    
                    // ドキュメント生成
                    this.progressManager.updateStep('document-generation', 'processing');
                    this.logger.info('ドキュメントを生成中...');
                    this.sessionId = response.sessionId;
                    this.ui.updateSummary(response.summary);
                    this.progressManager.updateStep('document-generation', 'completed');
                    
                    // コーチング覚書作成
                    this.progressManager.updateStep('coaching-notes', 'processing');
                    this.logger.info('コーチング覚書を作成中...');
                    this.ui.updateDocument(response.document);
                    this.progressManager.updateStep('coaching-notes', 'completed');
                    
                    // 対話処理
                    this.progressManager.updateStep('interaction', 'processing');
                    this.logger.info('応答を生成中...');
                    this.ui.addAIMessage(response.response);
                    this.progressManager.updateStep('interaction', 'completed');
                    
                } else {
                    this.logger.info('既存のセッションに返答を処理中');
                    this.progressManager.updateStep('interaction', 'processing');
                    const response = await this.api.processResponse(this.sessionId, message);
                    this.ui.addAIMessage(response.response);
                    this.progressManager.updateStep('interaction', 'completed');
                }

                this.ui.setStatus('準備完了', 'ready');
                this.logger.info('処理が完了しました');
                
            } catch (error) {
                this.logger.error('エラーが発生しました', error);
                this.progressManager.steps.forEach(step => {
                    if (step.status === 'processing') {
                        this.progressManager.updateStep(step.id, 'error');
                    }
                });
                this.ui.setStatus('エラーが発生しました', 'error');
                this.ui.addAIMessage('申し訳ありません。エラーが発生しました。もう一度お試しください。');
            } finally {
                this.ui.enableInput();
            }
        });
    }
}

// アプリケーションの初期化
window.addEventListener('DOMContentLoaded', () => {
    new AICoachingApp();
});