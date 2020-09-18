import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../Styles/LoginScreenStyles.js';
import { LoginManager } from 'react-native-fbsdk'
import { GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import Entypo from 'react-native-vector-icons/Entypo';


export default class LoginScreen extends Component{
    constructor(props){
        super();
        this.state = {
            isSigninInProgress:false,
            userInfo:null
        }

        GoogleSignin.configure({
            scopes: [],
            webClientId: 'add yor webclient here',
            offlineAccess: true, 
            hostedDomain: '', 
            forceConsentPrompt: true,
            accountName: ''
        });
    }


    handleGoogleLogin = async () => {
        try {
           await GoogleSignin.hasPlayServices();
           const userInfo = await GoogleSignin.signIn();
            console.log('_____userinfo',userInfo)
            this.setState({ userInfo });
        } catch (error) {
            console.log(error)
        }
   }

   handleFacebookLogin () {
        LoginManager.logInWithPermissions(['public_profile', 'email', 'user_friends']).then(
        function (result) {
            if (result.isCancelled) {
            console.log('Login cancelled')
            } else {
            console.log('Login success with permissions: ' + result.grantedPermissions.toString())
            }
        },
        function (error) {
            console.log('Login fail with error: ' + error)
        }
        )
    }


    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.facebookSignInButton} onPress={this.handleFacebookLogin}>
                    <Entypo name="facebook" size={30} style={styles.facebookIcon}/>
                    <Text style={styles.signInWithFacebookText}>Sign in with Facebook </Text>          
                </TouchableOpacity>

                <GoogleSigninButton
                    style={styles.googleSignInButton}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={()=>{this.handleGoogleLogin()}}
                    disabled={this.state.isSigninInProgress} 
                />

            </View>
        );
    }
}
    