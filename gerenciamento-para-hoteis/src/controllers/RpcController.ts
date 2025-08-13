import { Request, Response } from 'express';
import HotelService from '../services/HotelService';
import BookingService from '../services/BookingService';

class RpcController {
  async handle(req: Request, res: Response) {
    const { method, params } = req.body;

    switch (method) {
      case 'getHotels':
        const hotels = HotelService.findAll();
        return res.json(hotels);

      case 'getHotelById':
        const hotel = HotelService.findById(params.id);
        if (!hotel) {
          return res.status(404).json({ error: 'Hotel not found' });
        }
        return res.json(hotel);

      case 'createBooking':
        try {
          const booking = BookingService.create(params);
          return res.status(201).json(booking);
        } catch (error: any) {
          return res.status(error.statusCode || 400).json({ error: error.message });
        }

      default:
        return res.status(400).json({ error: 'Invalid method' });
    }
  }
}

export default new RpcController();