import { Request, Response } from 'express';
import HotelService from '../services/HotelService';

class HotelController {
  async index(req: Request, res: Response) {
    const hotels = await HotelService.findAll();
    res.json(hotels);
  }

  async show(req: Request, res: Response) {
    const hotel = await HotelService.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json(hotel);
  }

  async store(req: Request, res: Response) {
    const hotel = await HotelService.create(req.body);
    res.status(201).json(hotel);
  }

  async update(req: Request, res: Response) {
    const hotel = await HotelService.update(req.params.id, req.body);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json(hotel);
  }

  async delete(req: Request, res: Response) {
    const success = await HotelService.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.status(204).send();
  }
}

export default new HotelController();