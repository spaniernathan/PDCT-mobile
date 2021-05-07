import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
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
  };

  takePicture = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    const { cancelled, uri } = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
    });
    this.setState({ image: uri });
  };

  uploadPicture = async () => {
     const data = new FormData();
  
     data.append("file", {uri: Platform.OS === "android" ? this.state.image : this.state.image.replace("file://", ""), name: "test.jpg"});

     fetch("http://trackyourspot.millen.se/api/upload", {
       method: "POST",
       headers: {
         'Content-Type': 'multipart/form-data'
       },
       body: data
     }).then(response => response.json())
       .then(response => {
         console.log("upload succes", response);
         alert("Upload success!");
         this.uploadImageOnFireBase(this.state.image, "test-image");
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