import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from '../Styles/LoginScreenStyles.js';

export default class LoginScreen extends Component{
    
    render() {
        return (
            <View style={styles.container}>
                <Text>This is the login screen</Text>
            </View>
        );
    }
}
    