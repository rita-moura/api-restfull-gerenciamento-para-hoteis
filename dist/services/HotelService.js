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
Object.defineProperty(exports, "__esModule", { value: true });
class HotelService {
    constructor() {
        this.hotels = [];
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.hotels;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.hotels.find(hotel => hotel.id === id) || null;
        });
    }
    create(hotel) {
        return __awaiter(this, void 0, void 0, function* () {
            const newHotel = Object.assign(Object.assign({}, hotel), { id: Math.random().toString(36).substr(2, 9), createdAt: new Date(), updatedAt: new Date() });
            this.hotels.push(newHotel);
            return newHotel;
        });
    }
    update(id, hotel) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.hotels.findIndex(h => h.id === id);
            if (index === -1)
                return null;
            this.hotels[index] = Object.assign(Object.assign(Object.assign({}, this.hotels[index]), hotel), { updatedAt: new Date() });
            return this.hotels[index];
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.hotels.findIndex(h => h.id === id);
            if (index === -1)
                return false;
            this.hotels.splice(index, 1);
            return true;
        });
    }
}
exports.default = new HotelService();
