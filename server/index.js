const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const braintree = require("braintree");
const { MERCHANT_ID, PUBLIC_KEY, PRIVATE_KEY } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const gateway = new braintree.BraintreeGateway({
	environment: braintree.Environment.Sandbox,
	merchantId: MERCHANT_ID,
	publicKey: PUBLIC_KEY,
	privateKey: PRIVATE_KEY,
});

// Generate client token
app.get("/api/v1/client_token", (req, res) => {
	gateway.clientToken.generate({}, (err, response) => {
		if (err) throw err;

		console.log(response);
		// pass clientToken to your front-end
		const clientToken = response.clientToken;
		res.json({ clientToken });
	});
});

// Checkout
app.post("/api/v1/checkout", (req, res) => {
	const { paymentNonce } = req.body;
	const { amount } = req.body;

	// Create a transaction
	gateway.transaction.sale(
		{
			amount: parseFloat(amount),
			paymentMethodNonce: paymentNonce,
			options: {
				submitForSettlement: true,
			},
		},
		(err, result) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ err });
			}
			console.log(result);
			res.status(200).json({ result });
		}
	);
});

// Get Transaction details
app.get("/api/v1/transactions/:id", (req, res) => {
	console.log("ID: ", req.params.id);
	gateway.transaction.find(req.params.id, (err, transaction) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ errType: err.name });
		}
		const { processorResponseText } = transaction;
		res.status(200).json({ processorResponseText });
	});
});

app.listen(4300, () => console.log("App is live on port 4300"));
