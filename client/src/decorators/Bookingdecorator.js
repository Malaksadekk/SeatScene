class Booking {
  constructor(data) {
    this.show = data.show;
    this.theater = data.theater;
    this.time = data.time;
    this.selectedSeats = data.selectedSeats;
    this.totalPrice = data.totalPrice;
    this.paymentMethod = data.paymentMethod;
    this.user = data.user || null;
  }
}

class BookingDecorator {
  constructor(booking) {
    this.booking = booking;
  }

  addTimestamp() {
    this.booking.timestamp = new Date().toISOString();
    return this;
  }

  addConfirmationCode() {
    this.booking.confirmationCode = 'CONF-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    return this;
  }

  getBooking() {
    return this.booking;
  }
}

export { Booking, BookingDecorator };