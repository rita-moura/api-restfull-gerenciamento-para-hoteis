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

// Função para obter IPs da rede local dinamicamente
const getNetworkIps = (): string[] => {
  const ips: string[] = [];
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const anInterface = interfaces[name];
    if (anInterface) {
      for (const iface of anInterface) {
        if (iface.family === 'IPv4' && !iface.internal) {
          ips.push(iface.address);
        }
      }
    }
  }
  return ips;
};

// Gerar servidores dinamicamente
const generateServers = (): ServerObject[] => {
  const servers: ServerObject[] = [
    {
      url: 'http://localhost:3000',
      description: 'Servidor Local'
    }
  ];
  
  // Adicionar IPs da rede local
  const localIps = getNetworkIps();
  localIps.forEach(ip => {
    servers.push({
      url: `http://${ip}:3000`,
      description: `Servidor de Rede (${ip})`
    });
  });
  
  // Servidor genérico para deploy
  servers.push({
    url: 'http://{host}:{port}',
    description: 'Servidor de Deploy',
    variables: {
      host: {
        default: 'localhost',
        description: 'Hostname do servidor'
      },
      port: {
        default: '3000',
        description: 'Porta do servidor'
      }
    }
  });
  
  // Adicionar servidor HTTPS para produção
  servers.push({
    url: 'https://{host}',
    description: 'Servidor de Produção (HTTPS)',
    variables: {
      host: {
        default: 'api.exemplo.com',
        description: 'Hostname do servidor de produção'
      }
    }
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