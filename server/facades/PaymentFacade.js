// Simulated payment subsystems
class CardPayment {
  pay(amount, cardDetails) {
    // Simulate card payment logic
    return `Paid ${amount} EGP with card ending ${cardDetails.number.slice(-4)}`;
  }
}

class WalletPayment {
  pay(amount, walletId) {
    // Simulate wallet payment logic
    return `Paid ${amount} EGP from wallet ${walletId}`;
  }
}

class CashPayment {
  pay(amount) {
    // Simulate cash payment logic
    return `Paid ${amount} EGP in cash`;
  }
}

// Facade
class PaymentFacade {
  constructor() {
    this.cardPayment = new CardPayment();
    this.walletPayment = new WalletPayment();
    this.cashPayment = new CashPayment();
  }

  payWithCard(amount, cardDetails) {
    return this.cardPayment.pay(amount, cardDetails);
  }

  payWithWallet(amount, walletId) {
    return this.walletPayment.pay(amount, walletId);
  }

  payWithCash(amount) {
    return this.cashPayment.pay(amount);
  }
}

module.exports = PaymentFacade;


