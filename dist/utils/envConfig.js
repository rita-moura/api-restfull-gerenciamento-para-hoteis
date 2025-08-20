"use strict";
/**
 * Configurações de ambiente para a aplicação
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development',
    // URLs permitidas para CORS em produção
    allowedOrigins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
        : [],
    // Configuração específica para desenvolvimento
    isDevelopment: () => exports.config.nodeEnv === 'development',
    isProduction: () => exports.config.nodeEnv === 'production',
    // Base URL da API
    getBaseUrl: () => {
        if (exports.config.isProduction() && process.env.BASE_URL) {
            return process.env.BASE_URL;
        }
        return `http://${exports.config.host}:${exports.config.port}`;
    }
};
exports.default = exports.config;
