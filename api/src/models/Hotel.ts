interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  isAvailable: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  rating: number;
  rooms: Room[];
  createdAt: Date;
  updatedAt: Date;
}