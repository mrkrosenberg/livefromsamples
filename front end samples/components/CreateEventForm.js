import React, { useState, useContext } from 'react';
import { 
    View,
    ScrollView, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity,
    ActivityIndicator 
} from 'react-native';

// Context
import UserContext from '../context/UserContext';

// Firebase
import functions from '@react-native-firebase/functions';
import auth from '@react-native-firebase/auth';

// Image Upload functions
import { imagePickerOptions, uploadFileToFireBase } from '../utils/Firebase';

// Components
import ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
// import { Picker } from '@react-native-community/picker';

// Style Variables
import { colorPalette } from '../styles/ColorPalette';

const CreateEventForm = (props) => {

    // remove for testing deployed functions
    if (__DEV__) {
    functions().useFunctionsEmulator('http://localhost:5000');
    }

    const userContext = useContext(UserContext);
    const currentUser = auth().currentUser.displayName;

    // console.log('current user from auth: ', currentUser);

    const [ eventTitle, setTitle ] = useState('');
    const [ date, setDate ] = useState(new Date());
    const [ description, setDescription ] = useState('');
    const [ ticketPrice, setTicketPrice ] = useState(0);
    const [ imageURI, setImageURI ] = useState('');
    // const [ uploadComplete, setUploadComplete ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(false);


    const monitorFileUpload = uploadTask => {

        uploadTask.on('state_changed', snapshot => {
          switch (snapshot.state) {
            
            case 'running':
              setImageURI(null);
              setIsLoading(true);
              break;

            case 'success':
              snapshot.ref.getDownloadURL().then(downloadURL => {
                    setImageURI(downloadURL);
                    console.log('success: ', downloadURL);
                    setIsLoading(false);
                    // setUploadComplete(true);
               });
               break;

            default:
              break;
          }
        });
    };

    const handleImageUpload = () => {

        ImagePicker.launchImageLibrary(imagePickerOptions, response => {

          if (response.didCancel) {
            } else if (response.error) {
                console.log('response error: ', response.error)
            } else {
            const uploadTask = uploadFileToFireBase(response, userContext.displayName);
            monitorFileUpload(uploadTask);
          }
        });
    };

    // checks ticket price to make sure it's not NAN or infinite, converts to cents, returns value for create event function
    const isANumber = ticketPrice => {

        setIsLoading(true);
        const convertedTicketPrice = parseInt(ticketPrice);
        let formattedTicketPrice = '';

        if (typeof convertedTicketPrice == 'number' && convertedTicketPrice >= 0) {
            formattedTicketPrice = (convertedTicketPrice * 100);
        }

        if (typeof convertedTicketPrice !== 'number') {
            setIsLoading(false);
            return false;
        };

        if (convertedTicketPrice !== Number(convertedTicketPrice)) {
            setIsLoading(false);
            return false;
        };
      
        if (convertedTicketPrice === Infinity || convertedTicketPrice === !Infinity) {
            setIsLoading(false);
            return false;
        };

        if (ticketPrice < 0) {
            return false;
        };
        return formattedTicketPrice;
    };

    const handleSubmit = async () => {

        const dateString = date.toDateString();
        const timeString = date.toTimeString();
        const formattedTicketPrice = (ticketPrice * 100);
        const alternateDescription = 'An Exclusive Live From... Event';

        // make sure ticket price is a real number
        const isNumber = isANumber(ticketPrice);

        if (typeof isNumber == 'number' && isNumber >= 0) {
            eventObject = {
                title: eventTitle || userContext.displayName,
                artist: userContext.displayName,
                imageURI: imageURI,
                description: description || alternateDescription,
                date: dateString,
                time: timeString,
                ticketPrice: formattedTicketPrice || 0,
                playbackID: userContext.playbackID,
                isActive: false,
                ticketBatch: ''
            };
    
    
            props.handleEventSubmit(eventObject, userContext);
    
            setTitle('');
            setDate('');
            setDescription('');
            setTicketPrice('');
            setImageURI(null);
            setIsLoading(false);
    
        } else {
            setErrorMessage('Please enter ticket price in correct format. Example: 1 or 1.00');
        }; 
    };


    return (
        <View style={styles.formContainer}>
            <ScrollView>
            <View style={styles.cancelButton}>
                <Text onPress={props.showModal}>
                    X
                </Text>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    Create a New Event
                </Text>
            </View>
            <View style={styles.errorMessageContainer}>
                { errorMessage && 
                    <Text style={styles.errorMessageText}>
                        {errorMessage}
                    </Text>
                }
            </View>
            <View style={styles.eventForm}>
                <View style={styles.formSection}>
                    <Text style={styles.inputText}>
                        Event Title
                    </Text> 
                    <TextInput 
                        placeholder="event title"
                        style={styles.formInput}
                        autoCapitalize="none"
                        onChangeText={(title) => setTitle(title)}
                        value={eventTitle}
                    />
                </View>
                <View style={styles.formSection}>
                    <Text style={styles.inputText}>
                        Description
                    </Text>
                    <TextInput 
                        placeholder="event description"
                        style={[styles.formInput, {height: 100}]}
                        multiline={true}
                        numberOfLines={4}
                        autoCapitalize="none"
                        onChangeText={(description) => setDescription(description)}
                        value={description}
                    />
                </View>
                <View style={styles.formSection}>
                    <Text style={styles.inputText}>
                            Date
                        </Text>
                    <DatePicker 
                        date={date}
                        onDateChange={setDate}
                        style={{height: 100}}
                    />
                </View>
                <View style={styles.formSection}>
                    <Text style={styles.inputText}>
                        Ticket Price
                    </Text>
                    <TextInput
                        placeholder="format: 1 or 1.00 for $1 USD"
                        keyboardType="numeric"
                        style={styles.formInput}
                        autoCapitalize="none"
                        onChangeText={(price) => setTicketPrice(price)}
                        value={ticketPrice} 
                    />
                </View>
                <View style={[styles.formSection, styles.imageSection]}>
                    <TouchableOpacity onPress={handleImageUpload}>
                        <Text>
                            Upload image
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.iconContainer}>
                    </View>
                </View>
                <View style={styles.formSection}>
                    <TouchableOpacity 
                        onPress={handleSubmit}
                        style={styles.button}
                    >
                        <Text style={styles.inputText}>
                            Create Event
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.formSection}>
                    <ActivityIndicator 
                        animating={props.eventLoading}
                        size="large"
                        color={colorPalette.accentColor}
                    />
                </View>
            </View>
            {
                isLoading &&
                <ActivityIndicator 
                    animating={isLoading}
                    size="large"
                    style={styles.isLoading}
                    color={colorPalette.accentColor}
                />
            }
            </ScrollView>   
        </View>
    )
};

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginHorizontal: 10,
        marginVertical: 50,
        backgroundColor: colorPalette.tertiaryColor
    },  
    cancelButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20
    },  
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical:  30
    },
    title: {
    },
    errorMessageContainer: {
        flex: 1,
    },
    errorMessageText: {
        color: colorPalette.errorTextColor
    },
    eventForm: {
        flex: 1,
        // backgroundColor: 'green',
        color: 'white'
    },
    formSection: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center'
    },
    // formOptions: {
    //     flexDirection: 'row'
    // },
    button: {
        marginHorizontal: 50,
        marginTop: 30,
        backgroundColor: colorPalette.accentColor,
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageSection: {
        // flexDirection: 'row',
        // justifyContent: 'flex-start',
        // alignContent: 'flex-start'
    }, 
    iconContainer: {
        marginLeft: 10
    },
    pickerContainer: {
        // flex: 1
    },
    formInput: {
        // color: 'white'
    },
    inputText: {
        justifyContent: 'center',
        alignItems: 'center'
        // color: 'white'
    },
    submitButton: {
        flex: 2
    },
    isLoading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default CreateEventForm;
