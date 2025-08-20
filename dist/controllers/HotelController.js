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
class HotelController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const hotels = yield HotelService_1.default.findAll();
            res.json(hotels);
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const hotel = yield HotelService_1.default.findById(req.params.id);
            if (!hotel) {
                return res.status(404).json({ error: 'Hotel not found' });
            }
            res.json(hotel);
        });
    }
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const hotel = yield HotelService_1.default.create(req.body);
            res.status(201).json(hotel);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const hotel = yield HotelService_1.default.update(req.params.id, req.body);
            if (!hotel) {
                return res.status(404).json({ error: 'Hotel not found' });
            }
            res.json(hotel);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield HotelService_1.default.delete(req.params.id);
            if (!success) {
                return res.status(404).json({ error: 'Hotel not found' });
            }
            res.status(204).send();
        });
    }
}
exports.default = new HotelController();
