# API de Gerenciamento de Hotéis

Esta é uma API RESTful para gerenciamento de hotéis e reservas, desenvolvida com Node.js, Express e TypeScript, seguindo os princípios do Modelo de Maturidade de Richardson.

## Níveis do Modelo de Richardson

- **Nível 0 (RPC):** Implementado através de um endpoint `/rpc` que utiliza um único ponto de entrada para executar diferentes ações, simulando uma chamada de procedimento remoto. Isso demonstra o nível mais básico de maturidade de uma API web.
- **Nível 1 (Recursos):** A API expõe recursos como `/hotels` e `/bookings`.
- **Nível 2 (Verbos HTTP):** Utiliza os verbos HTTP corretos (GET, POST, PUT, DELETE) para as operações.
- **Nível 3 (HATEOAS):** As respostas incluem links para ações relacionadas, permitindo a descoberta de recursos.

## Como Executar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

   O servidor estará disponível em `http://localhost:3000`.

## Documentação da API

A documentação completa da API está disponível através do Swagger UI. Após iniciar o servidor, acesse:


`http://localhost:3000/api-docs`


A interface do Swagger fornece:
- Documentação detalhada de todos os endpoints
- Schemas dos modelos de dados
- Interface interativa para testar as requisições
- Exemplos de requisições e respostas

## Endpoints

### Hotéis

- `GET /hotels`: Lista todos os hotéis.
- `GET /hotels/:id`: Obtém um hotel específico.
- `POST /hotels`: Cria um novo hotel.
- `PUT /hotels/:id`: Atualiza um hotel existente.
- `DELETE /hotels/:id`: Remove um hotel.

### Reservas

- `GET /bookings`: Lista todas as reservas.
- `GET /bookings/:id`: Obtém uma reserva específica.
- `POST /bookings`: Cria uma nova reserva.
- `DELETE /bookings/:id`: Cancela uma reserva.
- `GET /hotels/:hotelId/bookings`: Lista todas as reservas de um hotel específico.

## Recursos Adicionais

- **HATEOAS**: Todas as respostas incluem links relacionados para facilitar a navegação na API.
- **Swagger UI**: Interface interativa para explorar e testar a API.
- **Tratamento de Erros**: Respostas de erro padronizadas com informações detalhadas.