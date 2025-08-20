/**
 * Configurações de ambiente para a aplicação
 */

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  host: process.env.HOST || 'localhost',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // URLs permitidas para CORS em produção
  allowedOrigins: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [],
    
  // Configuração específica para desenvolvimento
  isDevelopment: () => config.nodeEnv === 'development',
  isProduction: () => config.nodeEnv === 'production',
  
  // Base URL da API
  getBaseUrl: () => {
    if (config.isProduction() && process.env.BASE_URL) {
      return process.env.BASE_URL;
    }
    return `http://${config.host}:${config.port}`;
  }
};

export default config;