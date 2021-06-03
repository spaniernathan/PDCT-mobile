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
    if (imageRefs.items.length > 0) {
      const urls = await Promise.all(imageRefs.items.map(ref => ref.getDownloadURL()));
      for (let i = 0; i < urls.length; i++) {
          array.push({
            key: urls[i],
            value: firebase.storage().refFromURL(urls[i]).name}
            );
        }
    }
    this.setState({ images: array});
  }

  async componentDidUpdate() {
    var array = [];
    const imageRefs = await firebase.storage().ref().child('images/').listAll();
    try {
      if (imageRefs.items.length > 0) {
        const urls = await Promise.all(imageRefs.items.map((ref) => ref.getDownloadURL()));
        for (let i = 0; i < urls.length; i++) {
            array.push({
              key: urls[i],
              value: firebase.storage().refFromURL(urls[i]).name});
        }
      }
    } catch {console.log("oui c'est ici"); this.images = []; array = [];}
    if (this.images !== array) {
    this.setState({ images: array});
    }
  }
 
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  render() {
     return this.state.images.map(image => (
       <SafeAreaView key={image.key} style={styles.container}>
         <Text style={styles.imageText}>Melanoma: {image.value.replace(/[0-9]/g, '').replace(/::/, '').replace(/-/, '')}</Text>
         <Image key={image.key} source={{ uri: image.key }} style={styles.image}/>        
       </SafeAreaView>
    ));
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 21,
  },
  imageText: {
    fontSize: 16,
    paddingLeft: 15 
  },
  row: { 
    flexDirection: 'row' 
  },
  image: { 
    width: 100, 
    height: 100, 
    borderRadius: 400/2,
    margin: 15
  },
  container: {
    flexDirection: 'row',
    display: 'flex',
    backgroundColor: '#EAEDF0',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
  },
});
