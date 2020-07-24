import React, { Component } from 'react';
import { 
    View, 
    SafeAreaView, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity,
    ScrollView, 
    Platform,
    ActivityIndicator 
} from 'react-native';

// Firebase
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Style Variables
import  { colorPalette } from '../../styles/ColorPalette';

export class Signup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            userName: '',
            email: '',
            password: '',
            errorMessage: null,
            isLoading: false
        };
    };


    // function for sign up
    handleSignUp = async () => {

        this.setState({
            isLoading: true
        }, () => {
            auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((userObject) => {

                const currentUser = auth().currentUser;
                const displayName = this.state.userName;
                const displayNameCAPS = this.state.userName.toUpperCase();
                const userNameObject = {
                    userName: displayNameCAPS,
                    displayName: displayName
                };

                currentUser.updateProfile({
                    displayName: this.state.userName
                });
                firestore().collection('user_names')
                    .add(userNameObject)
                    .then(
                        console.log('user name added to db')
                    );   
            })
            .catch(error => 
                this.setState({ 
                    errorMessage: 'email is already in use by another account', 
                    email: '',
                    password: ''
                })
            )
        })
        
    };


    // function to check for duplicate user names - calls handleSignup
    checkDuplicateUserName = async () => {

        const displayNameCAPS = this.state.userName.toUpperCase();
       
        firestore().collection('user_names').where('userName', '==', displayNameCAPS).get()
        .then((snapshot) => {
            if(snapshot._docs.length > 0) {
                this.setState({
                    errorMessage: 'username unavailable, try another one'
                })
            } else {
                this.setState({
                    errorMessage: null
                },  () => {
                    this.handleSignUp();
                });
            }
        });     
    };


    render() {
        return (
            <SafeAreaView style={styles.authContainer}>
                <ScrollView>
                    <Text style={styles.greeting}>
                        Live From...
                    </Text>
                    <View style={styles.errorMessage}>
                        <Text>
                            {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                        </Text>
                    </View>
                    <View style={styles.form}>
                        <View>
                            <Text style={styles.inputTitle}>
                                Username
                            </Text>
                            <TextInput 
                                style={styles.input}
                                autoCapitalize="none"
                                onChangeText={userName => this.setState({ userName })}
                                value={this.state.userName}
                            />
                        </View>
                        <View style={{ marginTop: 32 }}>
                            <Text style={styles.inputTitle}>
                                Email Address
                            </Text>
                            <TextInput 
                                style={styles.input}
                                keyboardType="email-address" 
                                autoCapitalize="none"
                                onChangeText={email => this.setState({ email })}
                                value={this.state.email}
                            />
                        </View>
                        <View style={{ marginTop: 32 }}>
                            <Text style={styles.inputTitle}>
                                Password
                            </Text>
                            <TextInput 
                                style={styles.input} 
                                textContentType="newPassword"
                                secureTextEntry 
                                autoCapitalize="none"
                                onChangeText={password => this.setState({ password })}
                                value={this.state.password}
                            />
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={this.checkDuplicateUserName}>
                            <Text style={styles.signInText}>
                                Create Account
                            </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.signIn}
                        activeOpacity={1}
                        onPress={() => this.props.navigation.push('SignIn')}
                        >
                        <Text style={{color: "white"}}>
                            Already have an account?
                        </Text>
                        <Text style={styles.linkToSignIn}>
                            Sign in here
                        </Text>
                    </TouchableOpacity>
                    {
                        this.state.isLoading &&
                        <ActivityIndicator 
                            animating={this.state.isLoading}
                            size="large"
                            style={styles.isLoading}
                            color={colorPalette.accentColor}
                        />
                    }
                </ScrollView>
            </SafeAreaView>
        )
    }
};

const styles = StyleSheet.create({
    authContainer: {
        flex: 1,
        backgroundColor: colorPalette.primaryColor
    },
    greeting: {
        marginTop: 32,
        fontSize: 18,
        fontWeight: "400",
        textAlign: "center",
        color:  colorPalette.tertiaryColor
    },
    error: {
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    errorMessage: {
        height: 72, 
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30
    },
    inputTitle: {
        color: colorPalette.tertiaryColor,
        fontSize: 10,
        textTransform: "uppercase"
    },
    input: {
        borderBottomColor: colorPalette.tertiaryColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: colorPalette.tertiaryColor
    },
    button: {
        marginHorizontal: 30,
        marginTop: 30,
        backgroundColor: colorPalette.accentColor,
        borderRadius: 4,
        height: 52,
        alignItems: "center",
        justifyContent: "center"
    },
    signInText: {
        color: colorPalette.primaryColor,
        fontWeight: "500",
    },
    signIn:  {
        flexDirection: "row",
        textAlign: "center",
        justifyContent: "center",
        marginTop: 30
    },
    linkToSignIn: {
        marginLeft: 10,
        textDecorationLine: "underline",
        color: colorPalette.tertiaryColor
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


export default Signup;
