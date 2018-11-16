import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

function BalanceItem({
  contactId,
  contact,
  friendRequests,
  approveContact,
  showPayment,
  contacts,
}) {
  const balanceClasses = cx('counterpart__balance', {
    'counterpart__balance--red': contact.sum > 0,
    'counterpart__balance--green': contact.sum < 0,
  });

  return (
    <div className="counterpart">
      <div className="counterpart__name">
        <img
          className="user-container__avatar"
          src={
            contacts.contactList.filter(item => item.contact_id === Number(contactId)).length
              ? contacts.contactList.filter(item => item.contact_id === Number(contactId))[0]
                .avatar === ''
                ? `https://ui-avatars.com/api/rounded=true?name=${
                  contact.username
                }&size=50&background=eaae60`
                : contacts.contactList.filter(item => item.contact_id === Number(contactId))[0]
                  .avatar
              : ''
          }
          alt="avatar"
        />

        <h3 className="user-container__name">{contact.username}</h3>
      </div>

      <div className={balanceClasses}>
        {contact.sum < 0 ? <div>Owes you</div> : contact.sum === '0.00' ? null : <div>You owe</div>}
        £{contact.sum[0] === '-' ? (-contact.sum).toFixed(2) : contact.sum}
      </div>
      <div className="counterpart__btn">
        {friendRequests.includes(Number(contactId)) && (
          <button
            className="counterpart__btn approve-btn"
            type="button"
            onClick={() => approveContact(contactId)}
          >
            Approve
          </button>
        )}
        {contact.sum !== '0.00' &&
          !friendRequests.includes(Number(contactId)) && (
            <div className="counterpart__btn">
              <img
                className="counterpart__btn__img"
                alt="Pay"
                src="../../static/images/payBtn.png"
                id={contactId}
                onClick={() => showPayment(true, Number(contactId))}
              />
            </div>
        )}
      </div>
    </div>
  );
}

BalanceItem.propTypes = {
  contactId: PropTypes.string.isRequired,
  contact: PropTypes.object.isRequired,
  friendRequests: PropTypes.array.isRequired,
  approveContact: PropTypes.func.isRequired,
  showPayment: PropTypes.func.isRequired,
  contacts: PropTypes.object.isRequired,
};
export default BalanceItem;
