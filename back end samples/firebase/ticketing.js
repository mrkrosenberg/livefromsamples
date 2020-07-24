exports.createTicketBatch = functions.https.onCall( async (data, context) => {

    const eventID = data.eventID;
    const eventObject = data.eventObject;
    const userObject = data.userContext;

    // function to create ticket batch in firestore
    const addTicketBatch = (event) => {

        console.log('add ticket batch: ', event);
        return admin.firestore().collection('ticket_batches').doc(eventID).set({
            event
        }).then(response => {
            console.log('ticket batch created: ', response)
            return {
                type: 'success',
                data: event
            };
        }).catch(error => {
            console.log('ticket batch error: ', error)
            return {
                type: 'error'
            };
        }); 
    };


    // build ticket batch
    const buildTicketBatch = (ticketObject, productObject) => {

        console.log('batch builder: ', ticketObject, productObject)
        if (ticketObject.id) {
            // build ticket batch object
            const event = {
                title: eventObject.title,
                artist: eventObject.artist,
                imageURI: eventObject.imageURI,
                description: eventObject.description,
                date: eventObject.date,
                time: eventObject.time,
                ticketPrice: eventObject.ticketPrice,
                productRef: productObject.id,
            };
            return addTicketBatch(event);
        } else {
            return {
                type: 'error'
            }
        }
    };

    // build ticket product/price object
    const ticketProductObject = await stripe.products.create({
        name: eventID,
        description: 'ticket for concert',
        // metadata: {}
    }).then( async response => { 
        return response;
    }).catch(error => {
        return error;
    });

    if (ticketProductObject.id) {
        const ticketPriceObject = await stripe.prices.create({
            product: ticketProductObject.id,
            unit_amount: eventObject.ticketPrice,
            currency: 'usd'
        }).then(response => {
            return response;
        }).catch(error => {
            return error;
        });
        return buildTicketBatch(ticketPriceObject, ticketProductObject);
    } else {
        return {
            type: 'error'
        }
    };
});