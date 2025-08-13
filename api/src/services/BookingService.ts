import { Booking } from '../models/Booking';
import HotelService from './HotelService';

class BookingService {
  private bookings: Booking[] = [];

  async findAll(): Promise<Booking[]> {
    return this.bookings;
  }

  async findById(id: string): Promise<Booking | null> {
    return this.bookings.find(booking => booking.id === id) || null;
  }

  async create(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    // Verificar se o hotel existe
    const hotel = await HotelService.findById(booking.hotelId);
    if (!hotel) {
      const err = new Error('Hotel not found');
      (err as any).status = 404;
      throw err;
    }

    // Verificar se o quarto existe e está disponível
    const room = hotel.rooms.find(r => r.id === booking.roomId);
    if (!room) {
      const err = new Error('Room not found');
      (err as any).status = 404;
      throw err;
    }

    if (!room.isAvailable) {
        const err = new Error('Room is not available');
        (err as any).status = 400;
        throw err;
    }

    const newBooking: Booking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };

    // Atualizar disponibilidade do quarto
    room.isAvailable = false;
    await HotelService.update(hotel.id, { rooms: hotel.rooms });

    this.bookings.push(newBooking);
    return newBooking;
  }

  async cancel(id: string): Promise<boolean> {
    const booking = await this.findById(id);
    if (!booking) return false;

    // Liberar o quarto
    const hotel = await HotelService.findById(booking.hotelId);
    if (hotel) {
      const room = hotel.rooms.find(r => r.id === booking.roomId);
      if (room) {
        room.isAvailable = true;
        await HotelService.update(hotel.id, { rooms: hotel.rooms });
      }
    }

    const index = this.bookings.findIndex(b => b.id === id);
    this.bookings.splice(index, 1);
    return true;
  }

  async findByHotel(hotelId: string): Promise<Booking[]> {
    const hotel = await HotelService.findById(hotelId);
    if (!hotel) {
      const err = new Error('Hotel not found');
      (err as any).status = 404;
      throw err;
    }
    return this.bookings.filter(booking => booking.hotelId === hotelId);
  }
}

export default new BookingService();