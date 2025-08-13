import { Hotel } from '../models/Hotel';

class HotelService {
  private hotels: Hotel[] = [];

  async findAll(): Promise<Hotel[]> {
    return this.hotels;
  }

  async findById(id: string): Promise<Hotel | null> {
    return this.hotels.find(hotel => hotel.id === id) || null;
  }

  async create(hotel: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>): Promise<Hotel> {
    const newHotel: Hotel = {
      ...hotel,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.hotels.push(newHotel);
    return newHotel;
  }

  async update(id: string, hotel: Partial<Hotel>): Promise<Hotel | null> {
    const index = this.hotels.findIndex(h => h.id === id);
    if (index === -1) return null;

    this.hotels[index] = {
      ...this.hotels[index],
      ...hotel,
      updatedAt: new Date()
    };

    return this.hotels[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.hotels.findIndex(h => h.id === id);
    if (index === -1) return false;

    this.hotels.splice(index, 1);
    return true;
  }
}

export default new HotelService();