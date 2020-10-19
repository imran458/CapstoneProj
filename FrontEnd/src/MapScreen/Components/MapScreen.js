import React, {Component} from 'react';
import {View, Text, TouchableOpacity, SafeAreaView, Platform, PermissionsAndroid} from 'react-native';
import styles from '../Styles/MapScreenStyles.js';
import MapView, { Marker } from 'react-native-maps';
import SearchBar from 'react-native-search-bar';
import _ from 'lodash';
import env from 'react-native-config';

export default class MapScreen extends Component{
    constructor(props){
        super();
        if (Platform.OS === "android") {
            this.requestLocationPermission();
        }
        this.state = {
            region:{ 
                latitude: 37.78825,
                longitude: -122.4324
            },
            search: "",
            predictions: [],
            marker: [],
            bottomMargin: 1
        }
        this.handleChangeTextDebounced = _.debounce(this.handleChangeText, 1000);
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
            //console.log("REGION:", this.state.region);
        });
    };

    async handleChangeText(text){
      // this.setState({ search: text }, () => {
      //   console.log("TEXT CHANGED:", this.state.search);
      // });
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${env.API_KEY}&input=
      ${text}&location=${this.state.region.latitude}, ${this.state.region.longitude}&radius=2000`;
      try{
        const result = await fetch(url);
        const json =  await result.json();
        this.setState( {predictions: json.predictions} );
      } catch(err){
        console.log(err);
      }
    }

    //button to go back to current location???
    //pinpoint location
    async handleSelectedAddress(prediction){
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction['place_id']}&key=${env.API_KEY}`
      try{
        const result = await fetch(url);
        const json =  await result.json();
        this.setState( {region: { 
          latitude: json.result.geometry.location.lat,
          longitude: json.result.geometry.location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }});
        this.setState( {marker: { 
          latitude: json.result.geometry.location.lat,
          longitude: json.result.geometry.location.lng
        }}, () => {
          console.log("MARKER", this.state.marker);
        });
      } catch(err){
        console.log(err);
      }
    }

    render() {
        const predictions = this.state.predictions.map((prediction, index) => (
          <TouchableOpacity key={index} style={styles.container} onPress={() => this.handleSelectedAddress(prediction)}>
            <View>
              <Text style={styles.text}>
                {prediction.description}
              </Text>
            </View>
          </TouchableOpacity>
        ));
        return (
           <SafeAreaView style={{flex: 1}}>
            <SearchBar
              value={this.state.search}
              onChangeText={text=>
                this.handleChangeTextDebounced(text)
              }
              placeholder='Search'
            />
            {predictions}
            <MapView 
              region={this.state.region}
              onRegionChange={this.onRegionChange}
              style={{flex: 1, marginBottom: this.state.bottomMargin}}        
              zoomEnabled={true}  
              followsUserLocation={true}
              showsMyLocationButton={true}     
              showsUserLocation={true}
              annotations={this.state.marker} 
              onMapReady={() => this.setState({ bottomMargin: 0 })} 
            >
              <Marker coordinate={{ latitude: this.state.marker.latitude, longitude: this.state.marker.longitude }} />
            </MapView>
           </SafeAreaView>
        );
    }
}
    
    