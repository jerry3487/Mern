import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(paymentMethod || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardExpiryDate, setExpiryDate] = useState('');
  const [cardCvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cashOnDelivery, setCashOnDelivery] = useState(false);

  const [cardNumberError, setCardNumberError] = useState('');
  const [cardHolderNameError, setCardHolderNameError] = useState('');
  const [cardExpiryDateError, setExpiryDateError] = useState('');
  const [cardCvvError, setCvvError] = useState('');
  const [upiIdError, setUpiIdError] = useState('');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const validateCardFields = () => {
    let isValid = true;

    // Card Number Validation
    if (!cardNumber || cardNumber.length !== 16 || isNaN(cardNumber)) {
      setCardNumberError('Please enter a valid 16-digit card number');
      isValid = false;
    } else {
      setCardNumberError('');
    }

    // Card Holder Name Validation
    if (!cardHolderName || !/^[a-zA-Z\s]+$/.test(cardHolderName)) {
      setCardHolderNameError('Please enter a valid card holder name');
      isValid = false;
    } else {
      setCardHolderNameError('');
    }

    // Expiry Date Validation
    if (!cardExpiryDate || !/^\d{2}\/\d{2}$/.test(cardExpiryDate)) {
      setExpiryDateError('Please enter a valid expiry date (MM/YY)');
      isValid = false;
    } else {
      setExpiryDateError('');
    }

    // CVV Validation
    if (!cardCvv || cardCvv.length !== 3 || isNaN(cardCvv)) {
      setCvvError('Please enter a valid 3-digit CVV');
      isValid = false;
    } else {
      setCvvError('');
    }

    return isValid;
  };

  const validateUpiId = () => {
    if (!upiId) {
      setUpiIdError('Please enter a valid UPI ID');
      return false;
    } else {
      setUpiIdError('');
      return true;
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!paymentMethodName) {
      
      return;
    }

    let isValid = true;

    if (paymentMethodName === 'Card') {
      isValid = validateCardFields();
    } else if (paymentMethodName === 'UPI') {
      isValid = validateUpiId();
    }

    if (isValid) {
      ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
      localStorage.setItem('paymentMethod', paymentMethodName);

      if (paymentMethodName === 'Card') {
       
        ctxDispatch({ type: 'SAVE_CARD_DETAILS', payload: cardNumber });
      } else if (paymentMethodName === 'UPI') {
       
        ctxDispatch({ type: 'SAVE_UPI_DETAILS', payload: upiId });
      }

      navigate('/placeorder');
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="CashOnDelivery"
              label="Cash On Delivery"
              checked={paymentMethodName === 'CashOnDelivery'}
              onChange={() => setPaymentMethod('CashOnDelivery')}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Card"
              label="Credit/Debit Card"
              checked={paymentMethodName === 'Card'}
              onChange={() => setPaymentMethod('Card')}
            />
            {paymentMethodName === 'Card' && (
              <>
                <Form.Control
                  type="number"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <Form.Text className="text-danger">{cardNumberError}</Form.Text>
                <br></br>
                <Form.Control
                  type="text"
                  placeholder="Card Holder Name"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                />
                <Form.Text className="text-danger">{cardHolderNameError}</Form.Text>
                <br></br>
                <Form.Control
                  type="text"
                  placeholder="Expiry Date (MM/YY)"
                  value={cardExpiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
                <Form.Text className="text-danger">{cardExpiryDateError}</Form.Text>
              <br></br>
                <Form.Control
                  type="number"
                  placeholder="CVV"
                  value={cardCvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
                <Form.Text className="text-danger">{cardCvvError}</Form.Text>
              </>
            )}
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="UPI"
              label="UPI"
              checked={paymentMethodName === 'UPI'}
              onChange={() => setPaymentMethod('UPI')}
            />
            {paymentMethodName === 'UPI' && (
              <>
                <Form.Control
                  type="text"
                  placeholder="UPI ID"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <Form.Text className="text-danger">{upiIdError}</Form.Text>
              </>
            )}
          </div>
          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}