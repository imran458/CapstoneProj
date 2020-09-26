import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../Styles/LoginScreenStyles.js';
import { LoginManager, AccessToken} from 'react-native-fbsdk'
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

   handleFacebookLogin() {
       console.log("this is this: ", this);
        LoginManager.logInWithPermissions(['public_profile', 'email', 'user_friends']).then(
        function (result) {
            if (result.isCancelled) {
            console.log('Login cancelled')
            } else {
            console.log('Login success with permissions: ' + result.grantedPermissions.toString())
            AccessToken.getCurrentAccessToken().then((data) => {
                const { accessToken } = data;
                fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + accessToken)
                .then((response) => response.json())
                .then((json) => {
                    const ID = json.id
                    console.log("ID " + ID);

                    const EM = json.email
                    console.log("Email " + EM);

                    const FN = json.first_name
                    console.log("First Name " + FN);
                })
                .catch(() => {
                    reject('ERROR GETTING DATA FROM FACEBOOK')
                })})
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
                <TouchableOpacity style={styles.facebookSignInButton} onPress={() => {this.handleFacebookLogin()}}>
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
    