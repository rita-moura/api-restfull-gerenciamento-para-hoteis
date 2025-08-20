"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("../routes"));
const HotelService_1 = __importDefault(require("../services/HotelService"));
const BookingService_1 = __importDefault(require("../services/BookingService"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(routes_1.default);
describe('Booking Endpoints', () => {
    beforeEach(() => {
        // Reset the in-memory data before each test
        HotelService_1.default.hotels = [
            { id: '1', name: 'Hotel California', city: 'LA', rooms: [{ id: '101', number: '101', type: 'Standard', isAvailable: true }] },
        ];
        BookingService_1.default.bookings = [
            { id: '1', hotelId: '1', roomId: '101', guestName: 'John Doe', checkIn: new Date(), checkOut: new Date() },
        ];
    });
    it('should get all bookings', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/bookings');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0]).toHaveProperty('guestName', 'John Doe');
    }));
    it('should get a booking by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/bookings/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('guestName', 'John Doe');
    }));
    it('should return 404 for a non-existent booking', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/bookings/2');
        expect(res.statusCode).toEqual(404);
    }));
    it('should create a new booking', () => __awaiter(void 0, void 0, void 0, function* () {
        const newBooking = { hotelId: '1', roomId: '101', guestName: 'Jane Doe', checkIn: new Date(), checkOut: new Date() };
        const res = yield (0, supertest_1.default)(app).post('/bookings').send(newBooking);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('guestName', 'Jane Doe');
    }));
    it('should return 404 when creating a booking for a non-existent hotel', () => __awaiter(void 0, void 0, void 0, function* () {
        const newBooking = { hotelId: '2', roomId: '101', guestName: 'Jane Doe', checkIn: new Date(), checkOut: new Date() };
        const res = yield (0, supertest_1.default)(app).post('/bookings').send(newBooking);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error', 'Hotel not found');
    }));
    it('should return 404 when creating a booking for a non-existent room', () => __awaiter(void 0, void 0, void 0, function* () {
        const newBooking = { hotelId: '1', roomId: '102', guestName: 'Jane Doe', checkIn: new Date(), checkOut: new Date() };
        const res = yield (0, supertest_1.default)(app).post('/bookings').send(newBooking);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error', 'Room not found');
    }));
    it('should cancel a booking', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete('/bookings/1');
        expect(res.statusCode).toEqual(204);
    }));
    it('should return 404 when canceling a non-existent booking', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete('/bookings/2');
        expect(res.statusCode).toEqual(404);
    }));
    it('should get bookings by hotel', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/hotels/1/bookings');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0]).toHaveProperty('guestName', 'John Doe');
    }));
    it('should return 404 when getting bookings for a non-existent hotel', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/hotels/2/bookings');
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error', 'Hotel not found');
    }));
});
