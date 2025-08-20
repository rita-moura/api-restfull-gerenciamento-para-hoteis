"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hateoasMiddleware = void 0;
const addLinks = (resource, type, req) => {
    const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}` || 'http://172.17.0.1:3000';
    resource._links = [];
    if (type === 'hotel') {
        const hotel = resource;
        resource._links.push({
            href: `${baseUrl}/hotels/${hotel.id}`,
            rel: 'self',
            method: 'GET'
        }, {
            href: `${baseUrl}/hotels/${hotel.id}`,
            rel: 'update',
            method: 'PUT'
        }, {
            href: `${baseUrl}/hotels/${hotel.id}`,
            rel: 'delete',
            method: 'DELETE'
        }, {
            href: `${baseUrl}/hotels/${hotel.id}/bookings`,
            rel: 'bookings',
            method: 'GET'
        });
    }
    else if (type === 'booking') {
        const booking = resource;
        resource._links.push({
            href: `${baseUrl}/bookings/${booking.id}`,
            rel: 'self',
            method: 'GET'
        }, {
            href: `${baseUrl}/bookings/${booking.id}`,
            rel: 'cancel',
            method: 'DELETE'
        }, {
            href: `${baseUrl}/hotels/${booking.hotelId}`,
            rel: 'hotel',
            method: 'GET'
        });
    }
};
const hateoasMiddleware = (resourceType) => {
    return (req, res, next) => {
        const originalJson = res.json;
        res.json = function (body) {
            if (body) {
                if (Array.isArray(body)) {
                    body.forEach(resource => addLinks(resource, resourceType, req));
                }
                else {
                    addLinks(body, resourceType, req);
                }
            }
            return originalJson.call(this, body);
        };
        next();
    };
};
exports.hateoasMiddleware = hateoasMiddleware;
