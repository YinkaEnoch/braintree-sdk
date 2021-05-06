## BRAINTREE SDK

This repo contains the client and server configuration for getting braintree SDK to work. BrainTree supports a wide number of fiat transactions (Paypal, Venmo, Apple Pay etc.) and over 75 currencies, making it an ideal choice in getting and verifying fiat transactions.

- To get the repo running, a developer's account is required for getting the Merchant ID, Public Key and Private key
- Run `npm install` to install all dependencies
- Run `npm run start:server` to start the nodejs server
- Run `npm run start:client` to start the client

- REFERENCES
  1. [List of Currencies supported by Braintree API](https://developers.braintreepayments.com/reference/general/currencies)
  2. [Payment method types](https://developers.braintreepayments.com/guides/payment-method-types-overview)
