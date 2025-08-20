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
const BookingService_1 = __importDefault(require("../services/BookingService"));
class BookingController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield BookingService_1.default.findAll();
            res.json(bookings);
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield BookingService_1.default.findById(req.params.id);
            if (!booking) {
                return res.status(404).json({ error: 'Booking not found' });
            }
            res.json(booking);
        });
    }
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield BookingService_1.default.create(req.body);
                res.status(201).json(booking);
            }
            catch (error) {
                res.status(error.status || 400).json({ error: error.message });
            }
        });
    }
    cancel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield BookingService_1.default.cancel(req.params.id);
            if (!success) {
                return res.status(404).json({ error: 'Booking not found' });
            }
            res.status(204).send();
        });
    }
    findByHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield BookingService_1.default.findByHotel(req.params.hotelId);
                res.json(bookings);
            }
            catch (error) {
                res.status(error.status || 400).json({ error: error.message });
            }
        });
    }
}
exports.default = new BookingController();
