import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Card} from 'react-native-elements';

export default class CardList extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={[
            {key: 'Lorem ipsum 1'},
            {key: 'Lorem ipsum 2'},
            {key: 'Lorem ipsum 3'},
            {key: 'Lorem ipsum 4'}
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  card: {
    backgroundColor: '#EAEDF0',
    padding: 45,
    marginVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
});