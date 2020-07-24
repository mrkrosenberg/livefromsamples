import React, { Component } from 'react';
import { 
    View, 
    SafeAreaView,
    StatusBar, 
    Text,
    Modal, 
    StyleSheet, 
    TouchableOpacity
} from 'react-native';

// Context
import UserContext from '../../context/UserContext';

// Firebase Ref
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';

// Components
import AppHeader from '../../components/AppHeader';
import ScreenTitle from '../../components/ScreenTitle';
import InitializeStream from '../../components/InitializeStream';
import PromoContainer from '../../components/PromoContainer';
import CreateEventForm from '../../components/CreateEventForm';
import ArtistEventsList from '../../components/ArtistEventsList';

// Style Variables
import {  colorPalette } from '../../styles/ColorPalette';


export class ArtistPortal extends Component {

    constructor(props) {
        super(props);

        // Firebase function refs
        this.createEvent = functions().httpsCallable('createEvent');
        this.createTicketBatch = functions().httpsCallable('createTicketBatch');
        this.deleteEvent = functions().httpsCallable('deleteEvent');

        this.state = {

            eventObject: {
                title: '',
                date: '',
                time: ''
            },  
            showModal: false,
            showEventForm: false,   
            title: 'Artist Portal',
            eventMessage: '',
            eventLoading: false,
            // documentID: ''
        };
};

    setMessageText = (message) => {
        this.setState({
            eventMessage: message
        })
    };

    showModal = () => {
        this.setState({
            showModal: !this.state.showModal
        })
    };

    showEventForm = () => {
        this.setState({
            showEventForm: !this.state.showEventForm
        })
    };

    handleCreationStatus = () => {
        this.setState({
            eventLoading: !this.state.eventLoading
        });
    };

    openEventForm = () => {
        this.setState({
            eventMessage: ''
        }, () => {
            this.showModal();
        });
    };

    handleDeleteEvent = (docID) => {

        const errorMessage = `Your event: "${eventObject.title}" was created but there was an issue with configuring. Please delete manually and try again. We apologize for any inconvenience.`;
        const successMessage = 'There was an issue creating your event. Please try again.';

        this.deleteEvent(docID).then(response => {

            const deleteResponseType = response.data.type;
            console.log('delete event response: ', response)

            // if event is deleted, provide user feedback to create event again
            if (deleteResponseType == 'success') {
                console.log('event deleted');
                this.setMessageText(successMessage);
                this.handleCreationStatus();
            // if there was an error deleting event, handle error
            } else if (deleteResponseType == 'error') {
                console.log('error deleting event');
                this.setMessageText(errorMessage);
                this.handleCreationStatus();
            };
            this.showModal();
        })
        .catch(error => {
            this.setMessageText(errorMessage);
            this.handleCreationStatus();
            this.showModal();
        });
    };

    handleEventSubmit = (eventObject, userContext) => {

        this.handleCreationStatus();

        firestore().collection('events').add(eventObject).then(response => {

            const docID = response._documentPath._parts[1];
            const ticketBatchObject = {
                eventObject: eventObject,
                userContext: userContext,
                eventID: docID
            };
            // this.setState({
            //     docID: docID
            // });
            console.log('event id: ', response._documentPath._parts[1])

            this.createTicketBatch(ticketBatchObject).then(response => {

                console.log('response object from ticket batch: ', response);
                const responseType = response.data.type;
                console.log('made it here')

                if (responseType == 'success') {
                    const eventMessage = 'Event Added!';
                    this.setMessageText(eventMessage);
                    this.handleCreationStatus();
                    this.showModal(); 
                } else if (responseType == 'error') {
                    // call function to delete the event
                    console.log('document to delete: ', docID)
                    this.handleDeleteEvent(docID);
                };
                
            }).catch(error => {
                // call function to delete the event so we don't get events saved without ticket batches
                console.log('caught ticket batch error: ', error)
                this.handleDeleteEvent(docID);
            });
        }).catch(() => {
            console.log('firestore add error')
            const eventMessage = 'There was an error creating your event. Please try again.';
            this.setMessageText(eventMessage);
            // this.handleDeleteEvent(this.state.documentID)
            this.handleCreationStatus();
            this.showModal();
        });
    };


    render() {
        return (
            <SafeAreaView style={styles.portalScreen}>
                <StatusBar barStyle="light-content" />
                <AppHeader navigation={this.props.navigation}/>
                <View style={styles.titleContainer}>
                    <ScreenTitle title={this.state.title} />
                </View>
                {/* Renders options based on user having created a stream channel */}
                <UserContext.Consumer>
                    {context  => (
                        !context.streamInitialized ? 
                        // Renders option to create stream, promo component to explain stream
                        <View style={styles.eventsContainer}>
                            <View style={styles.initStreamContainer}>
                                <InitializeStream showEventForm={this.showEventForm} />     
                            </View>
                            <View style={styles.promoContainer}>
                                <PromoContainer />
                            </View>
                        </View>
                        : 
                        // User has created stream, renders option to create event, lists all user's events
                        <View style={styles.eventsContainer}>
                            <View style={styles.createEventContainer}>
                                <TouchableOpacity 
                                    onPress={this.openEventForm}
                                    style={styles.createEventButton}>
                                    <Text>
                                        Create New Event
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.eventMessageContainer}>
                                <Text style={styles.eventMessageText}>
                                    {this.state.eventMessage}
                                </Text>
                            </View>
                            <View style={styles.userEventsContainer}>
                                <View style={styles.eventListContainer}>
                                    <Text style={styles.eventListTitle}>
                                        Upcoming Events:
                                    </Text>
                                    <ArtistEventsList navigation={this.props.navigation}/>
                                </View>
                            </View>
                        </View>
                    )}
                </UserContext.Consumer>
                <Modal
                    animationType="slide"
                    visible={this.state.showModal}
                    transparent={true}>
                        <CreateEventForm 
                            showModal={this.showModal}
                            handleEventSubmit={this.handleEventSubmit}
                            eventLoading={this.state.eventLoading}
                        />
                </Modal>
            </SafeAreaView>
        )
    }
};

const styles = StyleSheet.create({
    portalScreen: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: colorPalette.primaryColor
    }, 
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    eventsContainer: {
        flex: 1
    },
    eventMessageContainer: {
        flex: 1, 
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    eventMessageText: {
        color: colorPalette.errorTextColor,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    initStreamContainer: {
        flex:1,
    },
    promoContainer:  {
        flex: 4,
        borderTopColor: colorPalette.tertiaryColor,
        borderTopWidth: 2
    },
    createEventContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }, 
    userEventsContainer: {
        flex: 6,
    }, 
    eventListContainer: {

    },
    eventListTitle: {
        color: colorPalette.tertiaryColor   
    }, 
    createEventButton: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 4,
        backgroundColor: colorPalette.accentColor
    }
});

export default ArtistPortal;