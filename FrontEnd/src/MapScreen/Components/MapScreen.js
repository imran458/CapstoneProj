import React, {Component} from 'react';
import {View, Text, TouchableOpacity, SafeAreaView, Platform, PermissionsAndroid} from 'react-native';
import styles from '../Styles/MapScreenStyles.js';
import MapView from 'react-native-maps';
import SearchBar from 'react-native-search-bar';

export default class MapScreen extends Component{
    constructor(props){
        super();
        if (Platform.OS === "android") {
            this.requestLocationPermission();
        }
        this.state = {
            region:{ 
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
        }
    }

    async requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Diggraffiti",
              message: "Allow Digraffiti to access your location"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            alert("Location access granted");
          } else {
            alert("Location access denied");
          }
        } catch (err) {
          console.warn(err);
        }
    }

    onRegionChange = (region) => {
        this.setState({ region }, () => {
            //console.log("HERE", this.state.region);
        });
    };

    render() {
        return (
           <SafeAreaView style={{flex: 1}}>
             {/* <SearchBar
               ref='searchBar'
               placeholder='Search'
             /> */}
             <View style={{ flex: 1}}>
            <MapView 
                onRegionChange={this.onRegionChange}
                style={{flex: 1}}        
                zoomEnabled={true}  
                followsUserLocation={true}
                showsMyLocationButton={false}     
                showsUserLocation={true}
            />
            </View>
           </SafeAreaView>
        );
    }
}
    
    