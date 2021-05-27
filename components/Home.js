import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import ApiKeys from '../database/firebase';
import * as firebase from 'firebase';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: undefined,
    }

    // Initialize firebase...
    if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FireBaseConfig); }
  }
  selectPicture = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      aspect: [4,3],
      allowsEditing: true,
    });
    if (!cancelled) this.setState({ image: uri });
    console.log("Gallery URI : ", uri);
  };

  takePicture = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    const { cancelled, uri } = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
    });
    this.setState({ image: uri });
    console.log("take URI : ", uri);
  };

  uploadPicture = async () => {
     const data = new FormData();
     let date = new Date();
     let result = '';

     let hours = date.getHours();
     let minutes = date.getMinutes();
     let seconds = date.getSeconds();
     data.append("file", {uri: Platform.OS === "android" ? this.state.image : this.state.image.replace("file://", ""), name: "test.jpg"});

     console.log("DATA : ", data);
     fetch("http://trackyourspot.millen.se/api/upload", {
    //  fetch("212.25.141.43:10000/api/upload", {
       method: "POST",
       headers: {
         'Accept': 'multipart/form-data',
         'Content-Type': 'multipart/form-data'
       },
       body: data
     }).then(response => response.text())
       .then(response => {
         if (response == "\"1\"\n") {
           result = 'malignant';
         }
         else {
           result = 'benign';
         }
         console.log("upload succes", result);
         Alert.alert(result);
         this.uploadImageOnFireBase(this.state.image, `${hours}:${minutes}:${seconds}-` + result);
         this.setState({ photo: null });
       })
       .catch(error => {
         console.log("upload error", error);
         alert("Upload failed!");
       });
  };

  uploadImageOnFireBase = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase.storage().ref().child("images/" + imageName);
    return ref.put(blob);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri: this.state.image }} />
        <View style={styles.row}>
          <Button onPress={this.selectPicture}>Gallery</Button>
          <Button onPress={this.takePicture}>Camera</Button>
          <Button onPress={this.uploadPicture}>Upload</Button>
        </View>
      </View>
    );
  }
}

const Button = ({ onPress, children }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  text: {
    fontSize: 21,
  },
  row: { flexDirection: 'row' },
  image: { width: 300, height: 300, backgroundColor: 'gray' },
  button: {
    padding: 13,
    margin: 15,
    backgroundColor: '#dddddd',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});