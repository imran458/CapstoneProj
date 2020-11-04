import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../Styles/LoginScreenStyles.js';
import { LoginManager, AccessToken} from 'react-native-fbsdk'
import { GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import {addFirstName, addLastName, addEmail} from '../../actions/loginInfo.js';
import axios from 'axios';
import {API_URL, GOOGLE_SIGN_IN_CLIENT_ID, Wikitude_AR_LICENSE_KEY} from "@env"

class LoginScreen extends Component{
    constructor(props){
        super();

        GoogleSignin.configure({
            scopes: [],
            webClientId: GOOGLE_SIGN_IN_CLIENT_ID,
            offlineAccess: true, 
            hostedDomain: '', 
            forceConsentPrompt: true,
            accountName: ''
        });
    }


    handleGoogleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            let userInfo = await GoogleSignin.signIn();
            let firstName = userInfo['user']['givenName'];
            let lastName = userInfo['user']['familyName'];
            let email = userInfo['user']['email'];
            let id = userInfo['user']['id'];
            
            this.props.addFirstName(firstName);
            this.props.addLastName(lastName);
            this.props.addEmail(email);
            this.sendUserInfoToBackend(firstName, lastName, email);
        } catch (error) {
            console.log(error)
        }
   }

   handleFacebookLogin = () => {
        LoginManager.logInWithPermissions(['public_profile', 'email', 'user_friends']).then(
            (result) => {
                if (result.isCancelled) {
                console.log('Login cancelled')
                } else {
                console.log('Sucessfully logged in with Facebook!');
                this.fetchFaceBookUserInfo();
                }
            },
            (error) => {
                console.log('Login fail with error: ' + error);
            }
        )
    }

    fetchFaceBookUserInfo(){
        AccessToken.getCurrentAccessToken().then((data) => {
            const { accessToken } = data;
            fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + accessToken)
            .then((response) => response.json())
            .then((json) => {
                let id = json.id
                let email = json.email
                let name = json.name
                let firstName = name.substr(0, name.indexOf(' ')); 
                let lastName = name.substr(name.indexOf(' ')+1);
            
                this.props.addFirstName(firstName);
                this.props.addLastName(lastName);
                this.props.addEmail(email);
                this.sendUserInfoToBackend(firstName, lastName, email);
                
            })
            .catch(() => {
                reject('Error getting data from Facebook!');
            })})
        }

    jumpToCameraScreen () {
        this.props.navigation.navigate('CameraScreen');
    }

    sendUserInfoToBackend(firstName, lastName, email){
        let url = '' + API_URL + '/api/auth';
        
        axios({
            method: 'post',
            url: url,
            data: {first: firstName, last: lastName, email: email}
          })
          .then((response) => { 
      
            console.log(response);
            this.jumpToCameraScreen();
          }, (error) => {
            
            console.log(error)
      
          });
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.facebookSignInButton} onPress={() => this.handleFacebookLogin()}>
                    <Entypo name="facebook" size={30} style={styles.facebookIcon}/>
                    <Text style={styles.signInWithFacebookText}>Sign in with Facebook </Text>          
                </TouchableOpacity>
                <GoogleSigninButton
                    style={styles.googleSignInButton}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={()=>this.handleGoogleLogin()}
                    disabled={false} 
                />
                <TouchableOpacity onPress={() => this.jumpToCameraScreen()} >
                    <AntDesign name="camera" size={30} />       
                </TouchableOpacity>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        firstName: state.loginReducer.firstName,
        lastName: state.loginReducer.lastName,
        email: state.loginReducer.email
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addFirstName: (firstName) => dispatch(addFirstName(firstName)),
        addLastName: (lastName) => dispatch(addLastName(lastName)),
        addEmail: (email)=> dispatch(addEmail(email)),
    }
}
    

export default connect(mapStateToProps, mapDispatchToProps) (LoginScreen);