import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList, Image } from 'react-native'
import CardList from './CardList';

function Details(props) {

  return (
    <>
      <Text style={styles.baseText}>
        <Text style={styles.titleText}>
          Your Records
          {"\n"}
          {"\n"}
        </Text>
        <Text numberOfLines={5}>Here, you will find the full archive of all {"\n"} images you have analysed using this {"\n"} app.</Text>
      </Text>
      <CardList/>
    </>
  );
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: "Arial",
    marginTop: '20%'
  },
  titleText: {
    fontSize: 23,
    fontWeight: "bold"
  }
});

export default Details;