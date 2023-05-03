'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Tomás Arrativel',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-04-27T17:01:17.194Z',
    '2023-04-30T23:36:17.929Z',
    '2023-05-02T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: navigator.language,
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
  movements: [200, -200, 340, -300, -20, 50, 400, 8063.21],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'hi-IN',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90, -2000, 94732],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'JPY',
  locale: 'ja-JP',
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

/////////////////////////////////////////////////
//  FUNCTIONS

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

//  formater of currencies
const formatCurren = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value.toFixed(2));
};

// Movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  //Sort movements
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatCurren(
          mov,
          acc.locale,
          acc.currency
        )}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Balance
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCurren(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

// Account username
const usernameCreator = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
usernameCreator(accounts);

//  Update for all the Movements part
const updateUI = function (acc) {
  //  Display Movements
  displayMovements(acc);

  //  Display Balance
  displayBalance(acc);

  //  Display Summary
  calcDisplaySummary(acc);
};

//Interest, incomes and outcomes
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurren(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurren(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int);
  labelSumInterest.textContent = formatCurren(
    interest,
    acc.locale,
    acc.currency
  );
};

const startLogOutTim = function () {
  const tick = () => {
    const min = `${Math.floor(time / 60)}`.padStart(2, 0);
    const sec = `${time % 60}`.padStart(2, 0);

    //  In each call, print time to the UI
    labelTimer.textContent = `${min}:${sec}`;

    //  Time = 0, stop timer and logout User
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Session closed due to inactivity';
      containerApp.style.opacity = 0;
    }

    //  Decrease 1s each call
    time--;
  };

  //  setting the time => 5m
  let time = 300;

  //  Call timer each second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

/////////////////////////////////////////////////
//  EVENT HANDLERS

// Login BTN
let currAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currAccount?.pin === +inputLoginPin.value) {
    //  Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    //  Timer of log Out
    if (timer) clearInterval(timer);
    timer = startLogOutTim();

    //  Create Date

    //  Experimenting with API
    const now = new Date();
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      weekday: 'short',
    };
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currAccount.locale,
      options
    ).format(now);

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

    //  Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //  Update the UI
    updateUI(currAccount);
  }
});

//  Transfer Btn
btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    currAccount.balance >= amount &&
    receiverAcc?.username !== currAccount.username &&
    receiverAcc?.username
  ) {
    currAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add transfer date
    currAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currAccount);

    //  Reset Timer
    clearInterval(timer);
    timer = startLogOutTim();
  }
});

//  Loan BTN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add the mov
      currAccount.movements.push(amount);

      //Add loan date
      currAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currAccount);
    }, 700);
  }

  inputLoanAmount.value = '';

  //  Reset Timer
  clearInterval(timer);
  timer = startLogOutTim();
});

//  Close Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currAccount.username &&
    +inputClosePin.value === currAccount.pin
  ) {
    //  Adding the index
    const index = accounts.findIndex(
      acc => acc.username === currAccount.username
    );

    //  Delete the acc
    accounts.splice(index, 2);

    //  Hide the UI
    containerApp.style.opacity = 0;
  }

  inputClosePin.value = inputCloseUsername.value = '';
});

//  BTN Sort
let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currAccount, !sorted);
  sorted = !sorted;
});
