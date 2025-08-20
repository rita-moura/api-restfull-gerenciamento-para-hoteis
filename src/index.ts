import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import os from 'os';
import path from 'path';
import fs from 'fs';
import routes from './routes';
import { hateoasMiddleware } from './middlewares/hateoas';
import { errorHandler } from './middlewares/errorHandler';
import config from './utils/envConfig';

const app = express();
const port = config.port;

// Configuração CORS mais robusta
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Permite requisições sem origin (como aplicações mobile ou Postman)
    if (!origin) return callback(null, true);

    // Permite localhost e IPs locais para desenvolvimento
    if (origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('192.168.') ||
      origin.includes('172.') ||
      origin.includes('10.')) {
      return callback(null, true);
    }

    // Para produção, verificar domínios permitidos
    if (config.isProduction() && config.allowedOrigins.length > 0) {
      if (config.allowedOrigins.includes(origin)) {
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

app.use(cors(corsOptions));

// Middleware para permitir OPTIONS em todas as rotas
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Início da Lógica do Swagger ---

let specs: any;

if (config.isProduction()) {
  // Em produção (Vercel), leia o arquivo gerado no build
  try {
    const swaggerFilePath = path.join(__dirname, 'swagger.json');
    const swaggerFile = fs.readFileSync(swaggerFilePath, 'utf8');
    specs = JSON.parse(swaggerFile);
  } catch (error) {
    console.error("Could not read swagger.json in production:", error);
    specs = { openapi: '3.0.0', info: { title: 'Error', version: '1.0.0', description: 'Could not load swagger spec.' }, paths: {} };
  }
} else {
  // Em desenvolvimento, gere dinamicamente
  const { specs: devSpecs } = require('./swagger');
  specs = devSpecs;
}

// Configuração específica do Swagger UI com opções adicionais
const swaggerOptions: swaggerUi.SwaggerUiOptions = {
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Rota para servir o swagger.json
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// --- Fim da Lógica do Swagger ---

// Aplicar middleware HATEOAS para os tipos de recursos
app.use('/hotels', hateoasMiddleware('hotel'));
app.use('/bookings', hateoasMiddleware('booking'));

// Adicionar rota raiz
app.get('/', (req, res) => {
  const baseUrl = config.getBaseUrl();
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

app.use(routes);
app.use(errorHandler);

// Função para obter os endereços IP da rede local
const getNetworkIps = (): string[] => {
  const ips: string[] = [];
  const interfaces = os.networkInterfaces();
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

export default app;