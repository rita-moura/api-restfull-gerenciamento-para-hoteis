import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import os from 'os';
import routes from './routes';
import { hateoasMiddleware } from './middlewares/hateoas';
import { errorHandler } from './middlewares/errorHandler';
import { specs } from './swagger';

const app = express();
const port = 3000;

app.use(cors({
  origin: '*', // Permite todas as origens
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));
app.use(express.json());

// Configuração do Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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
        if(anInterface) {
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
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Acesse localmente em: http://localhost:${port}`);
  
  const localIps = getNetworkIps();
  if (localIps.length > 0) {
    console.log('Ou acesse de outros dispositivos na mesma rede em:');
    localIps.forEach(ip => {
      console.log(`- http://${ip}:${port}`);
    });
  }
});