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
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(routes_1.default);
describe('Hotel Endpoints', () => {
    beforeEach(() => {
        // Reset the in-memory data before each test
        HotelService_1.default.hotels = [
            { id: '1', name: 'Hotel California', city: 'LA', rooms: [{ id: '101', number: '101', type: 'Standard', isAvailable: true }] },
        ];
    });
    it('should get all hotels', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/hotels');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0]).toHaveProperty('name', 'Hotel California');
    }));
    it('should get a hotel by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/hotels/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'Hotel California');
    }));
    it('should return 404 for a non-existent hotel', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/hotels/2');
        expect(res.statusCode).toEqual(404);
    }));
    it('should create a new hotel', () => __awaiter(void 0, void 0, void 0, function* () {
        const newHotel = { name: 'Grand Hotel', city: 'NY', rooms: [] };
        const res = yield (0, supertest_1.default)(app).post('/hotels').send(newHotel);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name', 'Grand Hotel');
    }));
    it('should update a hotel', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedHotel = { name: 'Hotel California Updated', city: 'LA', rooms: [] };
        const res = yield (0, supertest_1.default)(app).put('/hotels/1').send(updatedHotel);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'Hotel California Updated');
    }));
    it('should return 404 when updating a non-existent hotel', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedHotel = { name: 'Hotel California Updated', city: 'LA', rooms: [] };
        const res = yield (0, supertest_1.default)(app).put('/hotels/2').send(updatedHotel);
        expect(res.statusCode).toEqual(404);
    }));
    it('should delete a hotel', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete('/hotels/1');
        expect(res.statusCode).toEqual(204);
    }));
    it('should return 404 when deleting a non-existent hotel', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete('/hotels/2');
        expect(res.statusCode).toEqual(404);
    }));
});
