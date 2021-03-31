import React from 'react'
import StripeCheckout from 'react-stripe-checkout';

const StripeCheckoutButton = ({price})=>{
    const priceForStripe = price * 100
    const publishableKey = 'pk_test_51HHP0dAmAE9ayovgxGQNE9vszxhLotjxUwraTgMDNSJp72tkPqbJwzH0Xp5qjA7kWPm1udH8ZIas5oxcQBE17o3A0056J0zDhw'
    const onTonken = token => {
        console.log(token);
        alert('Payment Successful!');
    }
    return(
        <StripeCheckout
         label = "Pay Now"
         name = "e-comm-db"
         billingAddress 
         shippingAddress
         image = 'https://sendeyo.com/up/d/f3eb2117da'
         description= {`Your total is $${price}`}
         amount = {priceForStripe}
         panelLabel = 'Pay Now'
         token = {onTonken}
         stripeKey = {publishableKey}
        />
    )
}

export default StripeCheckoutButton;