exports.createUserObject = functions.auth.user().onCreate( async user => {


    const stripeCustomer = await stripe.customers.create({ email: user.email});

    // create customer object with stripeCustomer data
    const customerObject = {
        email: user.email,
        uid: user.uid,
        displayName: user.displayName,
        customerID: stripeCustomer.id,
        source: ''
    };
    
    const userObject = {
        email: user.email,
        uid: user.uid,
        displayName: user.displayName,
        streamID: '',
        playbackID: '',
        streamInitialized: false,
        tickets: []
    };
        return admin.firestore()
        .collection('users')
        .add( userObject )
        .then(() => {
            admin.firestore()
            .collection('stripe_customers')
            .add( customerObject )
            .then(console.log('customer created'))
        });
});