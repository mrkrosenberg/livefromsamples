exports.completeStripePayment = functions.https.onCall( async (data, context) => {


    const idempotencyKey = uuidv4();

    return stripe.charges.create({
        amount: data.amount,
        currency: data.currency,
        source: 'tok_mastercard',
        receipt_email: data.receiptEmail
    }, {
        idempotencyKey: idempotencyKey
    }).then(response => {
        return {
            type: 'success'
        }
    }).catch(error => {
        return {
            type: 'error'
        }
    })
});