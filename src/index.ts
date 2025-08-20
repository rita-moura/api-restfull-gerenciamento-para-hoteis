import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import os from 'os';
import routes from './routes';
import { hateoasMiddleware } from './middlewares/hateoas';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerCorsMiddleware, swaggerSecurityMiddleware } from './middlewares/swaggerCors';
import { specs } from './swagger';
import config from './utils/envConfig';
import './types/swagger'; // Importar tipos customizados

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

// Aplicar middlewares específicos para Swagger UI
app.use('/api-docs', swaggerCorsMiddleware);
app.use('/api-docs', swaggerSecurityMiddleware);
app.use('/api-docs', cors(corsOptions));
app.use('/api-docs', swaggerUi.serve);

app.get('/swagger.json', swaggerCorsMiddleware, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(specs);
});

// Aplicar middleware HATEOAS para os tipos de recursos
app.use('/hotels', hateoasMiddleware('hotel'));
app.use('/bookings', hateoasMiddleware('booking'));

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

app.listen(port, '0.0.0.0', () => {
  console.log(`\n✅ Servidor rodando na porta ${port}`);
  console.log(`✨ Acesse localmente em: http://localhost:${port}`);
  console.log(`📚 Documentação Swagger: http://localhost:${port}/api-docs`);

  const localIps = getNetworkIps();
  if (localIps.length > 0) {
    console.log('\n🌐 Ou acesse de outros dispositivos na mesma rede em:');
    localIps.forEach(ip => {
      console.log(`   - API: http://${ip}:${port}`);
      console.log(`   - Docs: http://${ip}:${port}/api-docs`);
    });
  }

  console.log('\n🔗 Endpoints disponíveis:');
  console.log('   - GET  /hotels');
  console.log('   - POST /hotels');
  console.log('   - GET  /hotels/:id');
  console.log('   - PUT  /hotels/:id');
  console.log('   - DELETE /hotels/:id');
  console.log('   - GET  /bookings');
  console.log('   - POST /bookings');
  console.log('   - GET  /bookings/:id');
  console.log('   - DELETE /bookings/:id');
  console.log('   - GET  /hotels/:hotelId/bookings');
  console.log('   - POST /rpc');
});