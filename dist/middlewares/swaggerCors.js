"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSecurityMiddleware = exports.swaggerCorsMiddleware = void 0;
/**
 * Middleware específico para resolver problemas de CORS com Swagger UI
 */
const swaggerCorsMiddleware = (req, res, next) => {
    // Headers específicos para Swagger UI
    const origin = req.headers.origin || '*';
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400'); // 24 horas
    // Headers específicos para evitar cache em assets do Swagger
    if (req.path.includes('swagger') || req.path.includes('api-docs')) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
    }
    // Responder OPTIONS requests imediatamente
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
    }
    next();
};
exports.swaggerCorsMiddleware = swaggerCorsMiddleware;
/**
 * Middleware para configurar cabeçalhos de segurança para o Swagger UI
 */
const swaggerSecurityMiddleware = (req, res, next) => {
    // Permitir frames para Swagger UI funcionar corretamente
    res.header('X-Frame-Options', 'SAMEORIGIN');
    res.header('Content-Security-Policy', "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "font-src 'self' data:; " +
        "connect-src 'self' *;");
    next();
};
exports.swaggerSecurityMiddleware = swaggerSecurityMiddleware;
