# Solução para Problemas de CORS com Swagger UI em Deploy

## Problema Identificado

O Swagger UI funciona perfeitamente em `localhost` mas apresenta erros de CORS quando deployado. Isso acontece porque:

1. **Assets externos**: O Swagger UI carrega recursos (CSS, JS) de CDNs externos
2. **Configuração CORS insuficiente**: Headers CORS não estavam configurados adequadamente para todos os cenários
3. **Falta de middleware específico**: Não havia tratamento especial para rotas do Swagger

## Soluções Implementadas

### 1. Configuração CORS Robusta (`src/index.ts`)

```typescript
const corsOptions = {
  origin: (origin: any, callback: any) => {
    // Permite requisições sem origin (apps mobile, Postman)
    if (!origin) return callback(null, true);
    
    // Permite localhost e IPs locais para desenvolvimento
    if (origin.includes('localhost') || origin.includes('127.0.0.1') || 
        origin.includes('192.168.') || origin.includes('172.')) {
      return callback(null, true);
    }
    
    // Para produção, adicione domínios específicos aqui
    return callback(null, true); // Permite tudo por enquanto
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};
```

### 2. Middleware Específico para Swagger (`src/middlewares/swaggerCors.ts`)

- **swaggerCorsMiddleware**: Headers CORS específicos para Swagger UI
- **swaggerSecurityMiddleware**: CSP e headers de segurança adequados

### 3. Servidores Dinâmicos no Swagger (`src/swagger.ts`)

- Detecção automática de IPs da rede local
- Servidor genérico configurável para deploy
- Múltiplas opções de servidor no Swagger UI

### 4. Endpoint JSON Direto

Endpoint `/swagger.json` para servir a especificação diretamente com CORS correto.

## Como Usar em Produção

### 1. Configure Domínios Permitidos

No arquivo `src/index.ts`, substitua a linha:

```typescript
return callback(null, true); // Permite tudo por enquanto
```

Por:

```typescript
const allowedOrigins = ['https://seudominio.com', 'https://app.seudominio.com'];
if (allowedOrigins.includes(origin)) {
  return callback(null, true);
}
return callback(new Error('Não permitido pelo CORS'));
```

### 2. Configure Variáveis de Ambiente

Adicione no seu deploy:

```bash
NODE_ENV=production
HOST=seu-host.com
PORT=3000
```

### 3. Configure o Proxy/Load Balancer

Se usando nginx, adicione:

```nginx
location /api-docs {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Headers CORS específicos para Swagger
    add_header Access-Control-Allow-Origin * always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
}
```

## Testes

Para testar se a solução funciona:

1. **Local**: `http://localhost:3000/api-docs`
2. **Rede**: `http://SEU-IP:3000/api-docs`
3. **Deploy**: `https://seu-dominio.com/api-docs`

## Troubleshooting

### Se ainda houver problemas:

1. **Verifique logs do navegador** para erros específicos de CORS
2. **Teste o endpoint JSON**: `/swagger.json` deve retornar a especificação
3. **Verifique headers**: Use DevTools para ver se os headers CORS estão presentes
4. **Teste com curl**:
   ```bash
   curl -H "Origin: https://seu-dominio.com" -v http://localhost:3000/api-docs
   ```

### Logs úteis:

```bash
# Ver requisições CORS
console.log('CORS Origin:', req.headers.origin);

# Ver headers de resposta
console.log('Response Headers:', res.getHeaders());
```