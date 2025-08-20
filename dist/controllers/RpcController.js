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
const HotelService_1 = __importDefault(require("../services/HotelService"));
const BookingService_1 = __importDefault(require("../services/BookingService"));
class RpcController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { method, params } = req.body;
            switch (method) {
                case 'getHotels':
                    const hotels = HotelService_1.default.findAll();
                    return res.json(hotels);
                case 'getHotelById':
                    const hotel = HotelService_1.default.findById(params.id);
                    if (!hotel) {
                        return res.status(404).json({ error: 'Hotel not found' });
                    }
                    return res.json(hotel);
                case 'createBooking':
                    try {
                        const booking = BookingService_1.default.create(params);
                        return res.status(201).json(booking);
                    }
                    catch (error) {
                        return res.status(error.statusCode || 400).json({ error: error.message });
                    }
                default:
                    return res.status(400).json({ error: 'Invalid method' });
            }
        });
    }
}
exports.default = new RpcController();
