import { GeminiProcessor } from './model.js';

export class AICoachingAPI {
    constructor(apiKey) {
        this.geminiProcessor = new GeminiProcessor(apiKey);
        this.sessions = new Map();
    }

    async startNewSession(userId, question) {
        try {
            const summary = await this.geminiProcessor.analyzeQuestion(question);
            const document = await this.geminiProcessor.generateDocument(summary);
            const notes = await this.geminiProcessor.createCoachingNotes(document);
            const response = await this.geminiProcessor.processInteraction(notes, "start");

            const session = {
                id: userId,
                summary,
                document,
                notes,
                lastResponse: response
            };

            this.sessions.set(userId, session);

            return {
                sessionId: userId,
                summary,
                document,
                response
            };
        } catch (error) {
            console.error('Session start error:', error);
            throw error;
        }
    }

    async processResponse(userId, userResponse) {
        const session = this.sessions.get(userId);
        if (!session) {
            throw new Error('セッションが見つかりません');
        }

        try {
            const response = await this.geminiProcessor.processInteraction(
                session.notes,
                userResponse
            );

            session.lastResponse = response;
            this.sessions.set(userId, session);

            return {
                sessionId: userId,
                response
            };
        } catch (error) {
            console.error('Response processing error:', error);
            throw error;
        }
    }

    endSession(userId) {
        this.sessions.delete(userId);
        return {
            sessionId: userId,
            status: 'completed'
        };
    }
}