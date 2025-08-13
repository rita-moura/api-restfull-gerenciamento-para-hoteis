import { Request, Response } from 'express';
import BookingService from '../services/BookingService';

class BookingController {
  async index(req: Request, res: Response) {
    const bookings = await BookingService.findAll();
    res.json(bookings);
  }

  async show(req: Request, res: Response) {
    const booking = await BookingService.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  }

  async store(req: Request, res: Response) {
    try {
      const booking = await BookingService.create(req.body);
      res.status(201).json(booking);
    } catch (error: any) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }

  async cancel(req: Request, res: Response) {
    const success = await BookingService.cancel(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(204).send();
  }

  async findByHotel(req: Request, res: Response) {
    try {
      const bookings = await BookingService.findByHotel(req.params.hotelId);
      res.json(bookings);
    } catch (error: any) {
      res.status(error.status || 400).json({ error: error.message });
    }
  }
}

export default new BookingController();