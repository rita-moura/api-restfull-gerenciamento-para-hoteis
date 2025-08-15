import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

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
    ],
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local'
      },
      {
        url: 'http://{localIp}:3000',
        description: 'Servidor de Rede',
        variables: {
          localIp: {
            default: '172.17.0.1',
            description: 'IP da máquina na rede local'
          }
        }
      }
    ],
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

// Gera o arquivo swagger.json se o script for executado diretamente
if (require.main === module) {
  console.log('Gerando swagger.json...');
  const swaggerSpec = swaggerJsdoc(options);
  fs.writeFileSync(
    path.resolve(__dirname, '../docs/swagger.json'),
    JSON.stringify(swaggerSpec, null, 2)
  );
  console.log('swagger.json gerado com sucesso em /docs.');
}