"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSwaggerJson = exports.specs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Gerar servidores dinamicamente
const generateServers = () => {
    const servers = [];
    if (process.env.VERCEL_URL) {
        servers.push({
            url: `https://${process.env.VERCEL_URL}`,
            description: 'Servidor de Produção (Vercel)'
        });
    }
    servers.push({
        url: 'http://localhost:3000',
        description: 'Servidor Local'
    });
    return servers;
};
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Gerenciamento de Hotéis',
            version: '1.0.0',
            description: 'API RESTful para gerenciamento de hotéis e reservas, seguindo o Modelo de Maturidade Richardson',
            contact: {
                name: 'Suporte API',
                email: 'suporte@api.com'
            },
        },
        tags: [
            { name: 'RPC', description: 'Operações via Remote Procedure Call (Nível 0)' },
            { name: 'Hotéis', description: 'Operações de gerenciamento de hotéis' },
            { name: 'Reservas', description: 'Operações de gerenciamento de reservas' },
        ],
        servers: generateServers(),
        components: {
            schemas: {
                Hotel: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        address: { type: 'string' },
                        rating: { type: 'number' },
                        rooms: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    number: { type: 'string' },
                                    type: { type: 'string' },
                                    price: { type: 'number' },
                                    isAvailable: { type: 'boolean' }
                                }
                            }
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Booking: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        hotelId: { type: 'string' },
                        roomId: { type: 'string' },
                        guestName: { type: 'string' },
                        checkInDate: { type: 'string', format: 'date-time' },
                        checkOutDate: { type: 'string', format: 'date-time' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'object',
                            properties: {
                                message: { type: 'string' },
                                status: { type: 'integer' },
                                timestamp: { type: 'string', format: 'date-time' },
                                path: { type: 'string' },
                                method: { type: 'string' }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.ts'],
};
exports.specs = (0, swagger_jsdoc_1.default)(options);
// Função para gerar arquivo swagger.json
const generateSwaggerJson = () => {
    try {
        console.log('Gerando swagger.json...');
        const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
        // Garantir que o diretório docs existe
        const docsDir = path_1.default.resolve(__dirname, '../docs');
        if (!fs_1.default.existsSync(docsDir)) {
            fs_1.default.mkdirSync(docsDir, { recursive: true });
        }
        fs_1.default.writeFileSync(path_1.default.resolve(docsDir, 'swagger.json'), JSON.stringify(swaggerSpec, null, 2));
        console.log('swagger.json gerado com sucesso em /docs.');
    }
    catch (error) {
        console.error('Erro ao gerar swagger.json:', error);
    }
};
exports.generateSwaggerJson = generateSwaggerJson;
// Gera o arquivo swagger.json se o script for executado diretamente
if (require.main === module) {
    (0, exports.generateSwaggerJson)();
}
