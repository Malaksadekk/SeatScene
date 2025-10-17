class Booking {
  constructor(details) {
    this.details = details;
  }

  getDescription() {
    return `Booking for ${this.details.eventName} at ${this.details.venue}`;
  }

  getTotalPrice() {
    return this.details.basePrice;
  }
}

module.exports = Booking;