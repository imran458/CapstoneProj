import React, {Component} from 'react';
import {View, Image} from 'react-native';
import styles from '../Styles/LoadingScreenStyles.js';

const FIVE_SECONDS = 9000;

export default class LoadingScreen extends Component{
    componentDidMount(){
        setTimeout(() => {
            this.props.navigation.navigate('LoginScreen');
        }, FIVE_SECONDS);
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../../../assets/logo.png')} style={styles.logo}/>
            </View>
        );
    }
}
    