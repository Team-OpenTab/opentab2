export function setStage(stage) {
  return {
    type: 'SET_STAGE',
    stage,
  };
}

// USER ACTIONS

export function setUserId(id) {
  return {
    type: 'SET_USER_ID',
    id,
  };
}

export function setUsername(username) {
  return {
    type: 'SET_USERNAME',
    username,
  };
}

export function setEmail(email) {
  return {
    type: 'SET_EMAIL',
    email,
  };
}

export function setPassword(password) {
  return {
    type: 'SET_PASSWORD',
    password,
  };
}

export function setValidationPassword(validationPassword) {
  return {
    type: 'SET_VALIDATION_PASSWORD',
    validationPassword,
  };
}

export function setPhone(phone) {
  return {
    type: 'SET_PHONE',
    phone,
  };
}

export function setUserType(userType) {
  return {
    type: 'SET_USER_TYPE',
    userType,
  };
}

export function loginUser() {
  return (dispatch, getState) => {
    const { email, password } = getState().user;
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        if (response.status === 200) {
          dispatch(setUserId(response.data.id));
          dispatch(setUsername(response.data.username));
          dispatch(setStage('balances'));
        }
      })
      .catch(error => console.log(error));
  };
}

export function createNewUser() {
  return (dispatch, getState) => {
    const { email, password, username, phone } = getState().user;
    fetch('/api/new-user', {
      method: 'POST',
      body: JSON.stringify({ email, password, username, phone }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        if (response.status === 200) {
          dispatch(setUserId(response.data.id));
          dispatch(setStage('balances'));
        }
      })
      .catch(error => console.log(error));
  };
}

// ROUND ACTIONS

export function setRoundId(roundId) {
  return {
    type: 'SET_ROUND_ID',
    roundId,
  };
}

export function setNewRound() {
  return (dispatch, getState) => {
    const { round } = getState();
    fetch('/api/new-round', {
      method: 'POST',
      body: JSON.stringify(round),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        dispatch(setRoundId(response.data.roundId));
      })
      .catch(error => error.log(error));
  };
}

export function addCheckedUser(counterpart) {
  return {
    type: 'ADD_CHECKED_USER',
    counterpart,
  };
}

export function setRoundBuyer(userId) {
  return {
    type: 'SET_ROUND_BUYER',
    userId,
  };
}

export function getRoundBuyer() {
  return (dispatch, getState) => {
    const userId = getState().user.id;
    dispatch(setRoundBuyer(userId));
  };
}

export function removeCheckedUser(counterpart) {
  return {
    type: 'REMOVE_CHECKED_USER',
    counterpart,
  };
}

export function resetRound() {
  return {
    type: 'RESET_ROUND',
  };
}

export function handleRoundCounterparts(counterpart) {
  return (dispatch, getState) => {
    const roundCounterparts = getState().round.counterpartIds;
    if (!roundCounterparts.includes(counterpart)) {
      dispatch(addCheckedUser(counterpart));
    } else {
      dispatch(removeCheckedUser(counterpart));
    }
  };
}

export function setAmount(totalAmount) {
  return {
    type: 'SET_AMOUNT',
    totalAmount,
  };
}

// BALANCES ACTIONS

export function receiveCounterpartBalances(balances) {
  return {
    type: 'RECEIVE_COUNTERPART_BALANCES',
    balances,
  };
}

export function receiveUserBalance(balance) {
  return {
    type: 'RECEIVE_USER_BALANCE',
    balance,
  };
}

export function fetchBalances(userId) {
  return dispatch => {
    fetch(`/api/get-balances/${userId}`)
      .then(res => res.json())
      .then(response => {
        const userBalance = Object.assign(
          {},
          {
            [userId]: Object.values(response.data.balances)
              .reduce((a, b) => parseInt(a.sum) + parseInt(b.sum), 0)
              .toFixed(2),
          },
        );
        const userIds = Object.keys(response.data.balances);
        const counterpartIds = userIds.filter(key => parseInt(key) !== userId);
        const counterpartBalances = {};
        counterpartIds.map(key =>
          Object.assign(counterpartBalances, { [key]: response.data.balances[key] }),
        );
        dispatch(receiveUserBalance(userBalance));
        dispatch(receiveCounterpartBalances(counterpartBalances));
      });
  };
}

// TODO: use values from state instead of hard coded values. Test with newest database version
export function settleBalance() {
  return (dispatch, getState) => {
    const payerId = getState().user.id;
    const { receiverId } = getState().payment;
    const amount = Number(
      getState().balances.counterpartBalances[getState().payment.receiverId].sum,
    );
    const pay = { payerId, receiverId, amount };
    fetch('/api/make-payment', {
      method: 'POST',
      body: JSON.stringify(pay),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .catch(error => console.log(error));
  };
}

export function showPayment(payment, receiverId) {
  return {
    type: 'SHOW_PAYMENT',
    payment,
    receiverId,
  };
}
