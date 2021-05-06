const form = document.querySelector("form");
const submit = document.querySelector("[type=submit]");
const outputPanel = document.querySelector("output");

const getClientToken = async () => {
	const res = await fetch("http://127.0.0.1:4300/api/v1/client_token");
	return await res.json();
};

const checkout = async () => {
	// Clear panel
	outputPanel.textContent = "";

	const { clientToken } = await getClientToken();

	braintree.client.create({ authorization: clientToken }, (err, instance) => {
		if (err) {
			console.error(err);
			return;
		}

		braintree.hostedFields.create(
			{
				client: instance,
				styles: {
					input: { "font-size": "14px", border: "1px solid grey" },
					"input.invalid": {
						color: "red",
					},
					"input.valid": {
						color: "green",
					},
				},
				fields: {
					number: {
						selector: "#card-number",
						placeholder: "4111 1111 1111 1111",
					},
					cvv: {
						selector: "#cvv",
						placeholder: "123",
					},
					expirationDate: {
						selector: "#expiration-date",
						placeholder: "10/2022",
					},
				},
			},
			(err, instance) => {
				if (err) {
					console.error(err);
					return;
				}

				submit.removeAttribute("disabled");
				form.addEventListener(
					"submit",
					(e) => {
						e.preventDefault();

						instance.tokenize(async (err, payload) => {
							if (err) {
								console.error(err);
								return;
							}

							// Disable submit button again
							submit.setAttribute("disabled", true);
							submit.textContent = "Making payment...";

							// Send nonce to server
							const res = await fetch("http://127.0.0.1:4300/api/v1/checkout", {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									paymentNonce: payload.nonce,
									amount: document.querySelector("#amount").value,
								}),
							});
							console.log(JSON.stringify(res));
							const data = await res.json();
							console.log(data);

							outputPanel.textContent = JSON.stringify(data, null, 2);
							submit.textContent = "Make payment";
							submit.removeAttribute("disabled");
						});
					},
					false
				);
			}
		);
	});
};

checkout();
