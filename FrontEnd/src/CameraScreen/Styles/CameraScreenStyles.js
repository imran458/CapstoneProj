import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#be0000',
    justifyContent: 'center', 
    alignItems: 'center', 
    flex: 1
  },

  mapMarkerIcon: {
    position: 'absolute',
    right: '8%',
    top: 15
  },

  strokeColorButton: {
    marginHorizontal: 2.5, 
    marginVertical: 8, 
    width: 30, 
    height: 30,
    borderRadius: 15,
  },
    
  strokeWidthButton: {
    width: 40, 
    height: 40, 
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    top: 3,
    left: -10
  },
    
  close: {
    height: 30, 
    width: 60,
    backgroundColor: 'transparent', 
    justifyContent: 'center', 
    alignItems: 'center', 
    top: 8,
  },

  paintBrush: {
    position: 'absolute',
    top: 470,
    left: '6%'
  },

  trash: {
    height: 30, 
    width: 60,
    backgroundColor: 'transparent', 
    justifyContent: 'center', 
    alignItems: 'center',
    top: 8,
    left: 7,
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
    left: 5
  },

  eraser: {
    height: 30, 
    width: 60,
    backgroundColor: 'transparent', 
    justifyContent: 'center', 
    alignItems: 'center',
    top: 8,
    left: 0,
  },

  sketchContainer: {
    backgroundColor: 'transparent', 
    flex: 1
  },

  sketchCanvas: {
    backgroundColor: 'transparent', 
    flex: 1,
  },

  cameraView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0, 
    bottom: 0
  },

  savedImage: {
    width: 300, 
    height: 300,
    backgroundColor: 'transparent'
  },

  imageNameInput: {
    height: 40,
    width: 200,
    backgroundColor: 'white',
    paddingLeft: 32,
    marginBottom: 20,
    borderRadius: 20,
    top: '60%',
    position: 'absolute'
  },

  nameSketchText: {
    position: 'absolute',
    alignSelf: 'center', 
    top: '0%', 
    fontWeight: 'bold'
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginTop: 0
  },

  modalView: {
    margin: 20,
    width: '70%',
    top: '20%',
    height: 160,
    backgroundColor: "#e5e5e5",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute'
  },
  
  cancelText: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    position: 'absolute',
    top: '26%',
    left: '34%',
    fontWeight: 'bold'
  },

  cancelButton: {
    backgroundColor: "transparent",
    top: '99%',
    right: '35.5%',
    height: '30%',
    width: '75%',
    position: 'relative'
  },

  submitButton: {
    backgroundColor: "transparent",
    top: '69%',
    left: '33%',
    height: '30%',
    width: '71.5%',
    position: 'relative'
  },

  submitText: {
    color: "green",
    fontWeight: "bold",
    textAlign: "center",
    position: 'absolute',
    top: '26%',
    left: '34%',
    fontWeight: 'bold'
  },

  editIcon: {
    position: 'absolute', 
    top: '67%', 
    left: '13%'
  },

  image: {
    position: 'absolute',
    top: '20%',
    left: '2.5%',
    width: 300,
    height: 300,
    backgroundColor: 'white'
  },

});