import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native'
import {Card} from 'react-native-elements';
import ApiKeys from '../database/firebase';
import * as firebase from 'firebase';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: undefined,
    }

    // Initialize firebase...
    if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FireBaseConfig); }
  }

  deleteData = async () => {
    const imageRefs = await firebase.storage().ref().child('images/').listAll();
    imageRefs.delete();
  };

  render() {
    return (
      <>
        <Text style={styles.baseText}>
          <Text style={styles.titleText}>
            Your Profile
            {"\n"}
            {"\n"}
          </Text>
          <Text numberOfLines={5}>While we do not collect any data from {"\n"}you, you can delete all your data used {"\n"}by this app anytime.</Text>
        </Text>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={[
              {key: 'Read about Melanomas'},
              {key: 'Check for App Update'},
              {key: 'Delete all App Data'}
            ]}
            renderItem={({item}) => (
              <Card containerStyle={styles.card}>
                <TouchableOpacity>
                  <Text>{item.key}</Text>
                </TouchableOpacity>
              </Card>
            )}
          />
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: "Arial",
    marginTop: '20%'
  },
  titleText: {
    fontSize: 23,
    fontWeight: "bold"
  },
  container: {
    flex: 1,
    paddingTop: 22,
  },
  card: {
    backgroundColor: '#EAEDF0',
    padding: 30,
    marginVertical: 30,
    borderRadius: 10,
    justifyContent: 'center',
  }
});
