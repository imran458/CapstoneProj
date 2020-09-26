import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from '../Styles/LoadingScreenStyles.js';

const FIVE_SECONDS = 5000;

export default class LoadingScreen extends Component{
    componentDidMount(){
        setTimeout(() => {
            this.props.navigation.navigate('LoginScreen');
        }, FIVE_SECONDS);
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Text>Diggraffiti</Text>
            </View>
        );
    }
}
    