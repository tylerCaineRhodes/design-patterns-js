// Command pattern - represents an instruction to perform a particular action.
// Contains all the information necessary for the action to be taken.

class BankAccount {
  constructor(balance = 0) {
    this.balance = balance;
  }

  deposit(amount) {
    this.balance += amount;
    console.log(`Deposited ${amount}, balance is now ${this.balance}`);
  }

  withdraw(amount) {
    if (this.balance - amount >= BankAccount.overdraftLimit) {
      this.balance -= amount;
      console.log(`Withdrew ${amount}, balance is now ${this.balance}`);
      return true;
    }
    return false;
  }

  toString() {
    return `Balance: ${this.balance}`;
  }
}

BankAccount.overdraftLimit = -500;

const Action = Object.freeze({
  deposit: 1,
  withdraw: 2,
});

class BankAccountCommand {
  constructor(account, action, amount) {
    this.account = account;
    this.action = action;
    this.amount = amount;
    this.succeeded = false;
  }

  call() {
    switch (this.action) {
      case Action.deposit:
        this.account.deposit(this.amount);
        this.succeeded = true;
        break;
      case Action.withdraw:
        this.succeeded = this.account.withdraw(this.amount);
        break;
    }
  }

  undo() {
    if (!this.succeeded) return;

    switch (this.action) {
      case Action.deposit:
        this.account.withdraw(this.amount);
        this.succeeded = true;
        break;
      case Action.withdraw:
        this.succeeded = this.account.deposit(this.amount);
        break;
    }
  }
}

const ba = new BankAccount(100);
const deposit = new BankAccountCommand(ba, Action.withdraw, 650);

deposit.call();
console.log(ba.toString());

deposit.undo();
console.log(ba.toString());

const Action = Object.freeze({
  deposit: 0,
  withdraw: 1,
});

class Command {
  constructor(action, amount) {
    this.action = action;
    this.amount = amount;
    this.success = false;
  }
}

class Account {
  constructor() {
    this.balance = 0;
  }

  process(cmd) {
    switch (cmd.action) {
      case Action.deposit:
        this.balance += cmd.amount;
        cmd.success = true;
        break;
      case Action.withdraw:
        if (this.balance - cmd.amount < 0) {
          cmd.success = false;
          break;
        }
        this.balance -= cmd.amount;
        cmd.success = true;
        break;
    }
  }
}
