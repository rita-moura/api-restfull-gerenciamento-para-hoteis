import express from 'express';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { hateoasMiddleware } from './middlewares/hateoas';
import { errorHandler } from './middlewares/errorHandler';
import { specs } from './swagger';

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});