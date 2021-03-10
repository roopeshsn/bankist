'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Roopesh Saravanan',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 3.5, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-02-16T14:11:59.604Z',
    '2021-02-17T17:01:17.194Z',
    '2021-02-18T11:36:17.929Z',
    '2021-02-19T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
let currentAccount, timer;

const form = document.querySelector('.login');
const btnLogout = document.querySelector('.btn-logout');
const footerText = document.querySelector('.footer-text');

btnLogout.classList.add('remove');
footerText.classList.add('remove');

// FAKE ALWAYS LOGGED IN (FOR DEVELOPMENT PURPOSE)
// currentAccount = account1
// updateUI(currentAccount)
// containerApp.style.opacity = 100

// Functions
function formatDateMovements(date, locale) {
  const calcDaysPassed = (dateOne, dateTwo) =>
    Math.round(Math.abs(dateTwo - dateOne) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) {
    return 'Today';
  } else if (daysPassed === 1) {
    return 'Yesterday';
  } else if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  } else {
    // const day = `${date.getDate()}`.padStart(2, 0)
    // const month = `${date.getMonth() + 1}`.padStart(2, 0)
    // const year = date.getFullYear()
    return new Intl.DateTimeFormat(locale).format(date);
  }
}

function formattedCurrencies(value, locale, currency) {
  const options = {
    style: 'currency',
    currency: currency,
  };
  return new Intl.NumberFormat(locale, options).format(value);
}

function startLogOutTimer() {
  function tick() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time == 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  }
  let time = 600;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}

function displayMovements(account) {
  containerMovements.innerHTML = '';
  account.movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(account.movementsDates[i]);
    const displayDate = formatDateMovements(date, account.locale);
    const displayCurrency = formattedCurrencies(mov, account.locale, account.currency);
    const html = `<div class='movements__row'>
        <div class='movements__type movements__type--${type}'><span class='transaction-number'>${
      i + 1
    }</span> ${type}</div>
        <div class='movements__date'>${displayDate}</div>
        <div class='movements__value'>${displayCurrency}</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

function createUsernames(accounts) {
  accounts.forEach((account) => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map((n) => n[0])
      .join('');
  });
}

function calcPrintBalance(account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  const displayBalance = formattedCurrencies(account.balance, account.locale, account.currency);
  labelBalance.textContent = displayBalance;
}

function calcDisplaySummary(account) {
  const totalDeposit = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const displayDeposit = formattedCurrencies(totalDeposit, account.locale, account.currency);
  labelSumIn.textContent = displayDeposit;

  const totalWithdrawal = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const displayWithdrawal = formattedCurrencies(
    Math.abs(totalWithdrawal),
    account.locale,
    account.currency
  );
  labelSumOut.textContent = displayWithdrawal;

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * account.interestRate) / 100)
    .reduce((acc, mov) => acc + mov, 0);

  const displayInterest = formattedCurrencies(interest, account.locale, account.currency);
  labelSumInterest.textContent = displayInterest;
}

createUsernames(accounts);

function updateUI(account) {
  displayMovements(account);
  calcPrintBalance(account);
  calcDisplaySummary(account);
}

// logging out user
function logout() {
  form.classList.remove('remove');
  btnLogout.classList.add('remove');
  footerText.classList.add('remove');
  labelWelcome.textContent = 'Log in to get started';
  containerApp.style.opacity = 0;
}

// const inrToUsd = 0.014
// const movementsUsd = account1.movements.map((mov) => inrToUsd * mov)

// Event Listeners
btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  currentAccount = accounts.find((account) => account.username === inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    // Creating Date
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
    // const now = new Date()
    // const day = `${now.getDate()}`.padStart(2, 0)
    // const month = `${now.getMonth() + 1}`.padStart(2, 0)
    // const year = now.getFullYear()
    // const hour = `${now.getHours()}`.padStart(2, 0)
    // const min = `${now.getMinutes()}`.padStart(2, 0)
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`
    // To clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    form.classList.add('remove');
    btnLogout.classList.remove('remove');
    footerText.classList.remove('remove');
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find((account) => account.username === inputTransferTo.value);
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    console.log('Transfer Success');
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    // Updating date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());
    // Updating User Interface
    updateUI(currentAccount);
    // Resetting Time
    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputTransferTo.value = inputTransferAmount.value = '';
  inputLoginPin.blur();
});

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  const condition = currentAccount.movements.some((mov) => mov >= loanAmount * 0.1);
  if (loanAmount > 0 && condition) {
    setTimeout(() => {
      // Add Movement
      currentAccount.movements.push(loanAmount);
      // Adding Loan Date
      currentAccount.movementsDates.push(new Date().toISOString());
      // Updating UI
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex((account) => account.username === currentAccount.username);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputLoginPin.blur();
});

btnLogout.addEventListener('click', (e) => {
  logout();
});
