import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Definir tipos para OpenAPI 3.0 Server Object
interface ServerVariable {
  enum?: string[];
  default: string;
  description?: string;
}

interface ServerObject {
  url: string;
  description?: string;
  variables?: Record<string, ServerVariable>;
}

// Gerar servidores dinamicamente
const generateServers = (): ServerObject[] => {
  const servers: ServerObject[] = [];

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

const options: swaggerJsdoc.Options = {
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

export const specs = swaggerJsdoc(options);

// Função para gerar arquivo swagger.json
export const generateSwaggerJson = (): void => {
  try {
    console.log('Gerando swagger.json...');
    const swaggerSpec = swaggerJsdoc(options);
    
    // Garantir que o diretório docs existe
    const docsDir = path.resolve(__dirname, '../docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.resolve(docsDir, 'swagger.json'),
      JSON.stringify(swaggerSpec, null, 2)
    );
    console.log('swagger.json gerado com sucesso em /docs.');
  } catch (error) {
    console.error('Erro ao gerar swagger.json:', error);
  }
};

// Gera o arquivo swagger.json se o script for executado diretamente
if (require.main === module) {
  generateSwaggerJson();
}