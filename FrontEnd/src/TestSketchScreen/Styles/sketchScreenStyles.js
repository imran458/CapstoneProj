import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#be0000',
    justifyContent: 'center', 
    alignItems: 'center', 
    flex: 1
  },

  strokeColorButton: {
    marginHorizontal: 2.5, 
    marginVertical: 8, 
    width: 30, 
    height: 30,
     borderRadius: 15,
  },

  strokeWidthButton: {
    marginHorizontal: 2.5, 
    marginVertical: 8, 
    width: 30, 
    height: 30, 
    borderRadius: 15,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'black'
  },

  functionButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    height: 30, 
    width: 60,
    backgroundColor: 'transparent', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 5,
  },

  paintBrush: {
    position: 'absolute',
    bottom: '5%',
    left: '-45%'
  },

  trash: {
    marginHorizontal: 2.5, 
    marginVertical: 8, 
    height: 30, 
    width: 60,
    backgroundColor: 'transparent', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 5,
  },

  save: {
    marginHorizontal: 2.5, 
    marginVertical: 8, 
    height: 30, 
    width: 60,
    backgroundColor: 'transparent', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 5,
  },

  eraser: {
    marginHorizontal: 2.5, 
    marginVertical: 8, 
    height: 30, 
    width: 60,
    backgroundColor: 'transparent', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 5,
  },

  sketchContainer: {
    backgroundColor: 'transparent', 
    flex: 1
  },

  sketchCanvas: {
    backgroundColor: 'transparent', 
    flex: 1 
  },

});