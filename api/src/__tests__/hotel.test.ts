import request from 'supertest';
import express from 'express';
import router from '../routes';
import HotelService from '../services/HotelService';

const app = express();
app.use(express.json());
app.use(router);

describe('Hotel Endpoints', () => {
  beforeEach(() => {
    // Reset the in-memory data before each test
    (HotelService as any).hotels = [
      { id: '1', name: 'Hotel California', city: 'LA', rooms: [{ id: '101', number: '101', type: 'Standard', isAvailable: true }] },
    ];
  });

  it('should get all hotels', async () => {
    const res = await request(app).get('/hotels');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('name', 'Hotel California');
  });

  it('should get a hotel by id', async () => {
    const res = await request(app).get('/hotels/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Hotel California');
  });

  it('should return 404 for a non-existent hotel', async () => {
    const res = await request(app).get('/hotels/2');
    expect(res.statusCode).toEqual(404);
  });

  it('should create a new hotel', async () => {
    const newHotel = { name: 'Grand Hotel', city: 'NY', rooms: [] };
    const res = await request(app).post('/hotels').send(newHotel);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Grand Hotel');
  });

  it('should update a hotel', async () => {
    const updatedHotel = { name: 'Hotel California Updated', city: 'LA', rooms: [] };
    const res = await request(app).put('/hotels/1').send(updatedHotel);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Hotel California Updated');
  });

  it('should return 404 when updating a non-existent hotel', async () => {
    const updatedHotel = { name: 'Hotel California Updated', city: 'LA', rooms: [] };
    const res = await request(app).put('/hotels/2').send(updatedHotel);
    expect(res.statusCode).toEqual(404);
  });

  it('should delete a hotel', async () => {
    const res = await request(app).delete('/hotels/1');
    expect(res.statusCode).toEqual(204);
  });

  it('should return 404 when deleting a non-existent hotel', async () => {
    const res = await request(app).delete('/hotels/2');
    expect(res.statusCode).toEqual(404);
  });
});