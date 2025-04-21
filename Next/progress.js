export class ProgressManager {
    constructor() {
        this.steps = [
            { id: 'question-analysis', name: '質問解析', status: 'pending' },
            { id: 'document-generation', name: 'ドキュメント生成', status: 'pending' },
            { id: 'coaching-notes', name: 'コーチング覚書作成', status: 'pending' },
            { id: 'interaction', name: '対話処理', status: 'pending' }
        ];
        this.listeners = new Set();
    }

    updateStep(stepId, status, progress = null) {
        const step = this.steps.find(s => s.id === stepId);
        if (step) {
            step.status = status;
            if (progress !== null) {
                step.progress = progress;
            }
            this.notifyListeners();
        }
    }

    resetProgress() {
        this.steps.forEach(step => {
            step.status = 'pending';
            delete step.progress;
        });
        this.notifyListeners();
    }

    addListener(callback) {
        this.listeners.add(callback);
    }

    removeListener(callback) {
        this.listeners.delete(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.steps));
    }
}