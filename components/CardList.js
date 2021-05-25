import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image
} from 'react-native';
import {Card} from 'react-native-elements';
import ApiKeys from '../database/firebase';
import * as firebase from 'firebase';

export default class CardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
    }
    if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FireBaseConfig); }
  }

  async componentDidMount() {
    var array = [];
    const imageRefs = await firebase.storage().ref().child('images/').listAll();
    const urls = await Promise.all(imageRefs.items.map((ref) => ref.getDownloadURL()));
    for (let i = 0; i < urls.length; i++) {
        array.push(urls[i]);
    }
    this.setState({ images: array});
  }

  render() {
     return this.state.images.map(image => (
       <SafeAreaView key={image} style={styles.container}>
         <Image key={image} source={{ uri: image }} style={{ width: 224, height: 224 }} />        
       </SafeAreaView>
    ));
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
