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
const HotelService_1 = __importDefault(require("./HotelService"));
class BookingService {
    constructor() {
        this.bookings = [];
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bookings;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bookings.find(booking => booking.id === id) || null;
        });
    }
    create(booking) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o hotel existe
            const hotel = yield HotelService_1.default.findById(booking.hotelId);
            if (!hotel) {
                const err = new Error('Hotel not found');
                err.status = 404;
                throw err;
            }
            // Verificar se o quarto existe e está disponível
            const room = hotel.rooms.find(r => r.id === booking.roomId);
            if (!room) {
                const err = new Error('Room not found');
                err.status = 404;
                throw err;
            }
            if (!room.isAvailable) {
                const err = new Error('Room is not available');
                err.status = 400;
                throw err;
            }
            const newBooking = Object.assign(Object.assign({}, booking), { id: Math.random().toString(36).substr(2, 9), createdAt: new Date() });
            // Atualizar disponibilidade do quarto
            room.isAvailable = false;
            yield HotelService_1.default.update(hotel.id, { rooms: hotel.rooms });
            this.bookings.push(newBooking);
            return newBooking;
        });
    }
    cancel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield this.findById(id);
            if (!booking)
                return false;
            // Liberar o quarto
            const hotel = yield HotelService_1.default.findById(booking.hotelId);
            if (hotel) {
                const room = hotel.rooms.find(r => r.id === booking.roomId);
                if (room) {
                    room.isAvailable = true;
                    yield HotelService_1.default.update(hotel.id, { rooms: hotel.rooms });
                }
            }
            const index = this.bookings.findIndex(b => b.id === id);
            this.bookings.splice(index, 1);
            return true;
        });
    }
    findByHotel(hotelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const hotel = yield HotelService_1.default.findById(hotelId);
            if (!hotel) {
                const err = new Error('Hotel not found');
                err.status = 404;
                throw err;
            }
            return this.bookings.filter(booking => booking.hotelId === hotelId);
        });
    }
}
exports.default = new BookingService();
