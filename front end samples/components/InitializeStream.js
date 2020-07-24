import React, { useState, useContext } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity 
} from 'react-native';
import { openComposer } from 'react-native-email-link';

// Context
import UserContext from '../context/UserContext';

// Firebase
import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';

// Style Variables
import  {colorPalette } from '../styles/ColorPalette';


function InitializeStream(props) {

    // remove for testing deployed functions
    if (__DEV__) {
        functions().useFunctionsEmulator('http://localhost:5000');
      }
    
    const [ errorMessage, setErrorMessage ] = useState('');
    const userContext = useContext(UserContext);
    const createMuxAsset = functions().httpsCallable('createAssetMux');


    const handleCreateStream = () => {

        setErrorMessage('');
    
        createMuxAsset(userContext)
        .then(response => {

            console.log('mux response type: ', response.data.type);
            const muxResponse = response.data.data;
            
            if(response.data.type == 'success') {
                console.log('successful mux response: ', muxResponse);
                firestore().collection('users').doc(userContext.userDocumentID).update({
                    streamID: muxResponse.stream_key,
                    streamInitialized: true,
                    playbackID: muxResponse.playback_ids[0].id
                }).then(
                    props.showEventForm()
                ).catch(error => {
                    console.log('document update error: ', error);
                    setErrorMessage(response.data.errorMessage);
                });
            } else if(response.data.type == 'error') {
                setErrorMessage(response.data.errorMessage);
            };   
        });
    };

    const handleEmail = () => {

        openComposer({
            to: 'support@livefrom.io',
            subject: 'Error Report: Stream Issues',
            body: 'There has been an error creating my stream channel. Please contact me with solutions.'
        });
    };

    return (
      <View style={styles.initStreamContainer}>
        { 
            !errorMessage ? 
                <View style={styles.initStreamMessageContainer}>
                    <Text style={styles.createStreamText}>
                        It looks like you don't have a channel created yet. 
                    </Text>
                    <Text style={styles.createStreamText} >
                        To create one, click here:
                    </Text>
                </View>
                :
                <View style={styles.initStreamMessageContainer}>
                    <Text style={styles.createStreamText}>
                        {errorMessage} 
                    </Text>
                    <TouchableOpacity onPress={() => handleEmail}>
                        <Text style={styles.emailText}>
                            support@livefrom.io
                        </Text>
                    </TouchableOpacity>
                </View>
        }
        
        <TouchableOpacity 
            style={styles.createStreamButton} 
            onPress={handleCreateStream}>
            <Text >
                Create Stream
            </Text>
        </TouchableOpacity>
      </View>  
    )
};

const styles = StyleSheet.create({
    initStreamContainer:  {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    initStreamMessageContainer: {
       justifyContent: 'center',
       alignItems: 'center' 
    },  
    createStreamText: {
        color: colorPalette.tertiaryColor,
    },
    createStreamButton: {
        marginTop: 15,
        marginBottom: 10,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: colorPalette.accentColor,
    },
    emailText: {
        marginTop: 5,
        color: colorPalette.accentColor,
        textDecorationLine: 'underline'
    }
})


export default InitializeStream;