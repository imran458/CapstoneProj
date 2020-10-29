import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from '../Styles/sketchScreenStyles.js';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default class SketchScreen extends Component{
    constructor(props){
        super();

        this.state = {
            pressed: false
        }
    }

    togglePressed(){
        this.setState({pressed: !this.state.pressed});
        console.log(this.state.pressed);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableOpacity style={styles.paintBrush} onPress={() => this.togglePressed()}>
                    <FontAwesome5 name="paint-brush" size={50}/>
                </TouchableOpacity>

                {this.state.pressed ?
                    <RNSketchCanvas
                        defaultStrokeIndex={0}
                        defaultStrokeWidth={5}
                        containerStyle={styles.sketchContainer}
                        canvasStyle={styles.sketchCanvas}
                        closeComponent={<View style={styles.close}><MaterialCommunityIcons name="window-close" size={40}/></View>}
                        onClosePressed={() => this.togglePressed()}
                        clearComponent={<View style={styles.trash}><Fontisto name="trash" size={35}/></View>}
                        eraseComponent={<View style={styles.eraser}><MaterialCommunityIcons name="eraser" size={45} /></View>}
                        strokeComponent={color => (<View style={[{ backgroundColor: color }, styles.strokeColorButton]}/>)}
                        strokeSelectedComponent={(color, index, changed) => {
                        return (<View style={[{backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]}/>)}}
                        strokeWidthComponent={(w) => {
                        return (<View style={styles.strokeWidthButton}>
                                    <View  style={{backgroundColor: 'white', marginHorizontal: 2.5,width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2 }} />
                                </View>
                        )}}
                        saveComponent={<View style={styles.save}><Entypo name="save" size={40} style={styles.facebookIcon}/></View>}
                        savePreference={() => {
                        return {
                            folder: 'RNSketchCanvas',
                            filename: String(Math.ceil(Math.random() * 100000000)),
                            transparent: false,
                            imageType: 'png'
                        }}}
                        
                    />
                    : null}
                </View>
            </View>
        );
    }
}
    