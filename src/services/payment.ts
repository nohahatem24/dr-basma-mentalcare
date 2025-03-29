import { loadStripe } from '@stripe/stripe-js';
import { Appointment } from '../types/appointment';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const paymentService = {
  async createPaymentIntent(appointment: Appointment) {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: appointment.price * 100, // Convert to cents
          currency: 'sar',
          appointmentId: appointment.id,
        }),
      });

      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      console.error('Error in createPaymentIntent:', error);
      throw error;
    }
  },

  async processPayment(appointment: Appointment, cardDetails: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  }) {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const clientSecret = await this.createPaymentIntent(appointment);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            number: cardDetails.number,
            exp_month: parseInt(cardDetails.expiry.split('/')[0]),
            exp_year: parseInt(cardDetails.expiry.split('/')[1]),
            cvc: cardDetails.cvv,
            billing_details: {
              name: cardDetails.name,
            },
          },
        },
      });

      if (error) throw error;

      // Update appointment payment status
      await fetch('/api/update-payment-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: appointment.id,
          paymentIntentId: paymentIntent.id,
          status: 'paid',
        }),
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error in processPayment:', error);
      throw error;
    }
  },

  async refundPayment(appointmentId: string) {
    try {
      const response = await fetch('/api/refund-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentId }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in refundPayment:', error);
      throw error;
    }
  },
}; 