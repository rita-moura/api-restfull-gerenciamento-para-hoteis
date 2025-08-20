"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
const os_1 = __importDefault(require("os"));
const routes_1 = __importDefault(require("./routes"));
const hateoas_1 = require("./middlewares/hateoas");
const errorHandler_1 = require("./middlewares/errorHandler");
const swagger_1 = require("./swagger");
const envConfig_1 = __importDefault(require("./utils/envConfig"));
const app = (0, express_1.default)();
const port = envConfig_1.default.port;
// Configuração CORS mais robusta
const corsOptions = {
    origin: (origin, callback) => {
        // Permite requisições sem origin (como aplicações mobile ou Postman)
        if (!origin)
            return callback(null, true);
        // Permite localhost e IPs locais para desenvolvimento
        if (origin.includes('localhost') ||
            origin.includes('127.0.0.1') ||
            origin.includes('192.168.') ||
            origin.includes('172.') ||
            origin.includes('10.')) {
            return callback(null, true);
        }
        // Para produção, verificar domínios permitidos
        if (envConfig_1.default.isProduction() && envConfig_1.default.allowedOrigins.length > 0) {
            if (envConfig_1.default.allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Não permitido pelo CORS'), false);
        }
        // Em desenvolvimento ou sem restrições, permite todas as origens
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};
app.use((0, cors_1.default)(corsOptions));
// Middleware para permitir OPTIONS em todas as rotas
app.options('*', (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Configuração específica do Swagger UI com opções adicionais
const swaggerOptions = {
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        validatorUrl: null, // Desabilita validação externa
    },
    customSiteTitle: "API de Gerenciamento de Hotéis",
    explorer: false, // Desabilita o explorador de URLs
};
// Configuração do Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.specs, swaggerOptions));
// Aplicar middleware HATEOAS para os tipos de recursos
app.use('/hotels', (0, hateoas_1.hateoasMiddleware)('hotel'));
app.use('/bookings', (0, hateoas_1.hateoasMiddleware)('booking'));
// Adicionar rota raiz
app.get('/', (req, res) => {
    res.json({
        message: 'API de Gerenciamento de Hotéis',
        documentation: '/api-docs',
        endpoints: {
            hotels: '/hotels',
            bookings: '/bookings',
            rpc: '/rpc'
        }
    });
});
app.use(routes_1.default);
app.use(errorHandler_1.errorHandler);
// Função para obter os endereços IP da rede local
const getNetworkIps = () => {
    const ips = [];
    const interfaces = os_1.default.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        const anInterface = interfaces[name];
        if (anInterface) {
            for (const iface of anInterface) {
                // Pular endereços internos (ex: 127.0.0.1) e não-ipv4
                if (iface.family === 'IPv4' && !iface.internal) {
                    ips.push(iface.address);
                }
            }
        }
    }
    return ips;
};
// Iniciar o servidor apenas em ambiente de desenvolvimento
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
        const networkIps = getNetworkIps();
        if (networkIps.length > 0) {
            console.log('Disponível também em:');
            networkIps.forEach(ip => {
                console.log(`- http://${ip}:${port}`);
            });
        }
    });
}
exports.default = app;
