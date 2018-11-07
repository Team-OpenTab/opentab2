import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import '../../styles/components/NewRound.scss';

function NewRound({
  users,
  affectAmountPaid,
  amount,
  monitorCheckedUser,
  handleButtonClick,
  // submitCheckedUsers,
  // checkedUsers,
}) {
  return (
    <section>
      <div className="new-round__title">New Round</div>
      <div className="new-round__amount">
        <input value={amount} onChange={event => affectAmountPaid(event.target.value)} />
      </div>
      <div className="new-round__users">
        {users.map(user => (
          <input onChange={() => monitorCheckedUser(user.id)} type="checkbox" checked />
        ))}
      </div>
      <Button
        buttonLabel="Add Round"
        buttonDestination="balances"
        handleButtonClick={handleButtonClick}
      />
    </section>
  );
}
NewRound.propTypes = {
  users: PropTypes.array.isRequired,
  affectAmountPaid: PropTypes.func,
  amount: PropTypes.number,
  monitorCheckedUser: PropTypes.func,
  submitCheckedUsers: PropTypes.func,
  checkedUsers: PropTypes.array,
  handleButtonClick: PropTypes.func,
};

export default NewRound;
