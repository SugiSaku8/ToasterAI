export class Logger {
    constructor() {
        this.logs = [];
        this.listeners = new Set();
    }

    log(level, message, data = null) {
        const logEntry = {
            timestamp: new Date(),
            level,
            message,
            data,
        };
        this.logs.push(logEntry);
        this.notifyListeners(logEntry);
        console.log(`[${level}] ${message}`, data || '');
    }

    info(message, data = null) {
        this.log('INFO', message, data);
    }

    warn(message, data = null) {
        this.log('WARN', message, data);
    }

    error(message, data = null) {
        this.log('ERROR', message, data);
    }

    debug(message, data = null) {
        this.log('DEBUG', message, data);
    }

    addListener(callback) {
        this.listeners.add(callback);
    }

    removeListener(callback) {
        this.listeners.delete(callback);
    }

    notifyListeners(logEntry) {
        this.listeners.forEach(callback => callback(logEntry));
    }

    getLogs() {
        return [...this.logs];
    }
}