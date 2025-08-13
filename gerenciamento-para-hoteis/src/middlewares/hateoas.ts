import { Request, Response, NextFunction } from 'express';
import { Hotel } from '../models/Hotel';
import { Booking } from '../models/Booking';

type ResourceType = 'hotel' | 'booking';

interface HateoasLink {
  href: string;
  rel: string;
  method: string;
}

const addLinks = (resource: any, type: ResourceType, req: Request): void => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  resource._links = [];

  if (type === 'hotel') {
    const hotel = resource as Hotel;
    resource._links.push(
      {
        href: `${baseUrl}/hotels/${hotel.id}`,
        rel: 'self',
        method: 'GET'
      },
      {
        href: `${baseUrl}/hotels/${hotel.id}`,
        rel: 'update',
        method: 'PUT'
      },
      {
        href: `${baseUrl}/hotels/${hotel.id}`,
        rel: 'delete',
        method: 'DELETE'
      },
      {
        href: `${baseUrl}/hotels/${hotel.id}/bookings`,
        rel: 'bookings',
        method: 'GET'
      }
    );
  } else if (type === 'booking') {
    const booking = resource as Booking;
    resource._links.push(
      {
        href: `${baseUrl}/bookings/${booking.id}`,
        rel: 'self',
        method: 'GET'
      },
      {
        href: `${baseUrl}/bookings/${booking.id}`,
        rel: 'cancel',
        method: 'DELETE'
      },
      {
        href: `${baseUrl}/hotels/${booking.hotelId}`,
        rel: 'hotel',
        method: 'GET'
      }
    );
  }
};

export const hateoasMiddleware = (resourceType: ResourceType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;

    res.json = function (body: any) {
      if (body) {
        if (Array.isArray(body)) {
          body.forEach(resource => addLinks(resource, resourceType, req));
        } else {
          addLinks(body, resourceType, req);
        }
      }

      return originalJson.call(this, body);
    };

    next();
  };
};