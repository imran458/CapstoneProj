import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
    },

    text: {
        fontSize: 18,
        padding: 7,
        color: 'black'
    },

    map1: {
        position: 'absolute',
        top: '10%',
        height: '100%',
        width: '100%',
    },

    map2: {
        position: 'absolute',
        top: '25%',
        height: '100%',
        width: '100%',
    },

    flatList1: {
        width: '100%', 
        height: '100%',
        backgroundColor: 'transparent',
    },

    flatList2: {
        flexGrow: .5,
        width: '100%', 
        height: '100%',
        backgroundColor: 'transparent',
    },

    overlay: {
        position: 'absolute',
        bottom: 300,
        left: 120,
        backgroundColor: 'rgba(255, 255, 255, 1)',
    },

    prediction: {
        backgroundColor: 'white',
        borderColor: '#ddd',
        position: 'relative'
    },

    divider: {
        width: "100%", 
        height: 1, 
        backgroundColor: "#ddd"
    }
});