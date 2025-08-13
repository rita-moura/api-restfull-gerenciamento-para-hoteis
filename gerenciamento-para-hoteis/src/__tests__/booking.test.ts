import request from 'supertest';
import express from 'express';
import router from '../routes';
import HotelService from '../services/HotelService';
import BookingService from '../services/BookingService';

const app = express();
app.use(express.json());
app.use(router);

describe('Booking Endpoints', () => {
  beforeEach(() => {
    // Reset the in-memory data before each test
    (HotelService as any).hotels = [
      { id: '1', name: 'Hotel California', city: 'LA', rooms: [{ id: '101', number: '101', type: 'Standard', isAvailable: true }] },
    ];
    (BookingService as any).bookings = [
      { id: '1', hotelId: '1', roomId: '101', guestName: 'John Doe', checkIn: new Date(), checkOut: new Date() },
    ];
  });

  it('should get all bookings', async () => {
    const res = await request(app).get('/bookings');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('guestName', 'John Doe');
  });

  it('should get a booking by id', async () => {
    const res = await request(app).get('/bookings/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('guestName', 'John Doe');
  });

  it('should return 404 for a non-existent booking', async () => {
    const res = await request(app).get('/bookings/2');
    expect(res.statusCode).toEqual(404);
  });

  it('should create a new booking', async () => {
    const newBooking = { hotelId: '1', roomId: '101', guestName: 'Jane Doe', checkIn: new Date(), checkOut: new Date() };
    const res = await request(app).post('/bookings').send(newBooking);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('guestName', 'Jane Doe');
  });

  it('should return 404 when creating a booking for a non-existent hotel', async () => {
    const newBooking = { hotelId: '2', roomId: '101', guestName: 'Jane Doe', checkIn: new Date(), checkOut: new Date() };
    const res = await request(app).post('/bookings').send(newBooking);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'Hotel not found');
  });

  it('should return 404 when creating a booking for a non-existent room', async () => {
    const newBooking = { hotelId: '1', roomId: '102', guestName: 'Jane Doe', checkIn: new Date(), checkOut: new Date() };
    const res = await request(app).post('/bookings').send(newBooking);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'Room not found');
  });

  it('should cancel a booking', async () => {
    const res = await request(app).delete('/bookings/1');
    expect(res.statusCode).toEqual(204);
  });

  it('should return 404 when canceling a non-existent booking', async () => {
    const res = await request(app).delete('/bookings/2');
    expect(res.statusCode).toEqual(404);
  });

  it('should get bookings by hotel', async () => {
    const res = await request(app).get('/hotels/1/bookings');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('guestName', 'John Doe');
  });

  it('should return 404 when getting bookings for a non-existent hotel', async () => {
    const res = await request(app).get('/hotels/2/bookings');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'Hotel not found');
  });
});