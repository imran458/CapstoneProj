import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'center', 
        alignItems: 'center', 
        flex: 1
    },

    googleSignInButton: {
        width: '51%', 
        height: '5%'
    },

    facebookSignInButton: {
        width: '49%', 
        height: '4.5%',
        backgroundColor: '#151515'
    },

    signInWithFacebookText: {
        color: 'white',
        top: '15%',
        alignSelf: 'center',
        left: '20%',
        position: 'absolute',
        fontWeight: 'bold'
    },

    facebookIcon: {
        color: 'white',
        width: '50%'
    }
    
});