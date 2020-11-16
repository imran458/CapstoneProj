import React, {Component} from 'react';
import {View, Text, TouchableOpacity, SafeAreaView, FlatList, ListItem, Platform, PermissionsAndroid} from 'react-native';
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
            region: { 
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            search: "",
            predictions: [],
            marker: {marker: { 
              latitude: 34.052235,
              longitude: -118.243683,
              latitudeDelta:.1,
              longitudeDelta: .1
            }},
            bottomMargin: 1,
            predictionsArrayEmpty: true
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
          console.log(err);
        }
    }

    onRegionChange = (region) => {
        this.setState({ region }, () => {
            //console.log("REGION:", this.state.region);
        });
    };

    async handleChangeText(text){
      this.setState({predictionsArrayEmpty: !this.state.predictionsArrayEmpty});
      this.setState({ search: text }, () => {
        console.log(this.state.search)
      });
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${env.API_KEY}&input=
      ${text}&location=${this.state.region.latitude}, ${this.state.region.longitude}&radius=2000`;
      try{
        const result = await fetch(url);
        const json =  await result.json();
        console.log(json.predictions.length);
        this.setState( {predictions: json.predictions} );
      } catch(err){
        console.log(err);
      }
    }

    async handleSelectedAddress(prediction){
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction['place_id']}&key=${env.API_KEY}`
      try{
        const result = await fetch(url);
        const json =  await result.json();
        //console.log(json); //here
        this.setState( {region: { 
          latitude: json.result.geometry.location.lat,
          longitude: json.result.geometry.location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }});
        this.setState( {
          //search: "",
          marker: { 
            latitude: json.result.geometry.location.lat,
            longitude: json.result.geometry.location.lng,
            latitudeDelta:.1,
            longitudeDelta: .1
        }}, () => {
          //console.log("MARKER", this.state.marker);
        });
      } catch(err){
        console.log(err);
      }
    }

    renderPrediction = ({ item }) => {
      return (
        <TouchableOpacity style={styles.prediction} onPress={() => this.handleSelectedAddress(item)}>
          <Text style={styles.text}>
            {item.description}
          </Text>
          <View style={styles.divider}/>
        </TouchableOpacity>
      );
    };

    render() {
        return (
          <SafeAreaView style={styles.container}>
          <SearchBar
              value={this.state.search}
              onChangeText={text=>
                this.handleChangeTextDebounced(text)
              }
              textColor='black'  
            />
            {this.state.search === "" ? 
              <View style={styles.container}>
                <FlatList 
                  style={styles.flatList1}
                  data={this.state.predictions}
                  renderItem={this.renderPrediction}
                />
                <MapView 
                  region={this.state.region}
                  style={styles.map1}
                  zoomEnabled={true}  
                  followsUserLocation={true}
                  showsMyLocationButton={true}     
                  showsUserLocation={true}
                  annotations={this.state.marker} 
                /> 
              </View>: 
              <View style={styles.container}>
                <FlatList 
                  style={styles.flatList2}
                  data={this.state.predictions}
                  renderItem={this.renderPrediction}
                />
                <MapView 
                    region={this.state.region}
                    style={styles.map2}
                    zoomEnabled={true}  
                    followsUserLocation={true}
                    showsMyLocationButton={true}     
                    showsUserLocation={true}
                    annotations={this.state.marker} 
                />
              </View>}
          </SafeAreaView>
        );
    }
}