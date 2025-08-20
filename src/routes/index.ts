import { Router } from 'express';
import HotelController from '../controllers/HotelController';
import BookingController from '../controllers/BookingController';
import RpcController from '../controllers/RpcController';

const router = Router();

/**
 * @swagger
 * /hotels:
 *   get:
 *     summary: Lista todos os hotéis
 *     tags: [Hotéis]
 *     responses:
 *       200:
 *         description: Lista de hotéis retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hotel'
 *       500:
 *         description: Erro ao buscar hotéis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/hotels', HotelController.index);

/**
 * @swagger
 * /hotels/{id}:
 *   get:
 *     summary: Obtém um hotel específico
 *     tags: [Hotéis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hotel encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       404:
 *         description: Hotel não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/hotels/:id', HotelController.show);

/**
 * @swagger
 * /hotels:
 *   post:
 *     summary: Cria um novo hotel
 *     tags: [Hotéis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hotel'
 *     responses:
 *       201:
 *         description: Hotel criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Não foi possível criar o hotel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/hotels', HotelController.store);

/**
 * @swagger
 * /hotels/{id}:
 *   put:
 *     summary: Atualiza um hotel existente
 *     tags: [Hotéis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hotel'
 *     responses:
 *       200:
 *         description: Hotel atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       404:
 *          description: Hotel não encontrado
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/hotels/:id', HotelController.update);

/**
 * @swagger
 * /hotels/{id}:
 *   delete:
 *     summary: Remove um hotel
 *     tags: [Hotéis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Hotel removido com sucesso
 *       404:
 *         description: Hotel não encontrado
 */
router.delete('/hotels/:id', HotelController.delete);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Lista todas as reservas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */
router.get('/bookings', BookingController.index);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Obtém uma reserva específica
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reserva encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Reserva não encontrada
 */
router.get('/bookings/:id', BookingController.show);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Cria uma nova reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Não foi possível criar a reserva
 */
router.post('/bookings', BookingController.store);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Cancela uma reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Reserva cancelada com sucesso
 *       404:
 *         description: Reserva não encontrada
 */
router.delete('/bookings/:id', BookingController.cancel);

/**
 * @swagger
 * /hotels/{hotelId}/bookings:
 *   get:
 *     summary: Lista todas as reservas de um hotel específico
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de reservas do hotel retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */
router.get('/hotels/:hotelId/bookings', BookingController.findByHotel);

// Rota para o endpoint RPC de Nível 0
/**
 * @swagger
 * /rpc:
 *   post:
 *     summary: Executa uma chamada de procedimento remoto (RPC)
 *     tags: [RPC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               method:
 *                 type: string
 *                 description: O método a ser executado.
 *                 example: getHotels
 *               params:
 *                 type: object
 *                 description: Os parâmetros para o método.
 *     responses:
 *       200:
 *         description: Sucesso
 *       400:
 *         description: Método inválido ou parâmetros incorretos
 */
router.post('/rpc', RpcController.handle);

export default router;