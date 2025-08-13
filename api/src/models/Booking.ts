export interface Booking {
  id: string;
  hotelId: string;
  roomId: string;
  guestName: string;
  checkInDate: Date;
  checkOutDate: Date;
  createdAt: Date;
}