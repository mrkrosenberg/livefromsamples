exports.createAssetMux = functions.https.onCall((data, context) => {

    console.log('data: ', data)

    return Video.LiveStreams.create({
        "playback_policy": [
            "public"
        ],
        "new_asset_settings": {
            "playback_policy": [
            "public"
            ],
        },
        "passthrough": "You shall pass!",
        "reduced_latency": true,
        "test" : false
    }).then(muxAsset => {
        // create object back here and send it to client instead of sending the entire mux object
        return {
             type: 'success',
             data: muxAsset,
             errorMessage: 'There has been an issue configuring your settings. Please try again. If the issue persists, contact customer support: ',       
        }; 
    }).catch(error => {
        return {
            type: 'error', 
            muxError: error,
            errorMessage: 'There was an error creating your stream. please try again. If the issue persists, contact customer support: '
        };
    });


});
