import React, { Component } from 'react';
import { 
    View, 
    SafeAreaView, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    ActivityIndicator
} from 'react-native';

// Firebase
import auth from '@react-native-firebase/auth';

// Style Variables
import { colorPalette } from '../../styles/ColorPalette';

export class Signin extends Component {

    state = {
        user: null,
        email: '',
        password: '',
        errorMessage: null,
        isLoading: false
    };

    // function for sign up
    handleSignUp = () => {

        this.setState({
            isLoading: true
        },() => {
            auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(
                this.setState({
                    isLoading: false
                })
            )
            .catch(error => {
                this.setState({ 
                    errorMessage: error.message, 
                    email: '',
                    password: ''
                })
            })
        });
        
    };


    render() {
        return (
            <SafeAreaView style={styles.authContainer}>
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
                            password
                        </Text>
                        <TextInput 
                            style={styles.input} 
                            secureTextEntry 
                            autoCapitalize="none"
                            onChangeText={password => this.setState({ password })}
                            value={this.state.password}
                        />
                    </View>
                </View>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={this.handleSignUp}>
                        <Text style={styles.signInText}>
                            Sign in
                        </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                        style={styles.signUp}
                        activeOpacity={1}
                        onPress={() => this.props.navigation.push('SignUp')}
                        >
                            <Text style={{color: colorPalette.tertiaryColor}}>
                                Don't have an account yet?
                            </Text>
                            <Text style={styles.linkToSignUp}>
                                Create one here
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
        color: colorPalette.tertiaryColor
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
        // backgroundColor: "#00ced1",
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
        color: colorPalette.tertiaryColor,
        fontWeight: "500",
        color: colorPalette.primaryColor
    },
    signUp:  {
        flexDirection: "row",
        textAlign: "center",
        justifyContent: "center",
        marginTop: 30
    },
    linkToSignUp: {
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

export default Signin;