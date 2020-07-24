import React, { Component } from 'react';
import { 
    View,
    SafeAreaView, 
    StatusBar,
    StyleSheet, 
} from 'react-native';

// User Context
import UserContext from '../../context/UserContext';

// Components
import UserEvent from '../../components/UserEvent';
import ArtistEvent from '../../components/ArtistEvent';
import { colorPalette } from '../../styles/ColorPalette';


export class Event extends Component {

    constructor(props) {
        super(props)

       this.eventData = props.route.params.item;
       this.navigation = props.navigation;

    };


    render() {
        return (
            <UserContext.Consumer>
                {context => (
                    <SafeAreaView style={styles.eventScreenContainer}>
                        <StatusBar barStyle='light-content'/>
                        <View style={styles.eventContainer}>
                            {
                                // change this conditional so event user id matches current user id
                                this.eventData.artist !== context.displayName ?
                                <UserEvent 
                                    navigation={this.navigation}
                                    eventData={this.eventData}
                                    // userHasTicket={this.state.userHasTicket}
                                />  
                                :
                                <ArtistEvent
                                    navigation={this.navigation} 
                                    eventData={this.eventData}
                                    artistInfo={context}
                                />
                            }
                        </View>
                    </SafeAreaView> 
                )}
            </UserContext.Consumer>   
        )
    }
};

const styles = StyleSheet.create({
    eventScreenContainer: {
        flex: 1,
        backgroundColor: colorPalette.primaryColor
    },
    eventContainer: {
        flex: 1
    },
});

export default Event;