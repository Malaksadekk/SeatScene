// Subject
class BookingSubject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

// Observer interface
class BookingObserver {
  update(data) {
    // To be implemented by concrete observers
    throw new Error('update() must be implemented');
  }
}

// Concrete Observer Example
class EmailNotificationObserver extends BookingObserver {
  update(data) {
    // Simulate sending an email
    console.log(`Email sent to ${data.userEmail}: Your booking for ${data.eventName} is confirmed.`);
  }
}

class SMSNotificationObserver extends BookingObserver {
  update(data) {
    // Simulate sending an SMS
    console.log(`SMS sent to ${data.userPhone}: Your booking for ${data.eventName} is confirmed.`);
  }
}

module.exports = {
  BookingSubject,
  BookingObserver,
  EmailNotificationObserver,
  SMSNotificationObserver
};



