```
import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...
    }
  }
  render() {
    return (
      ...
    );
  }
}


const styles = StyleSheet.create({
  A: {
    ...
  },
  B: {
    ...
  },
});
```

# Component
Component are "objects".
Component methods:
- constructor(props)
  - this.state
- render()

# Elements
- <View 
    style={{...}}></View>
- <Text 
    style={{...}}></Text>
- <TextInput
    style={{...}}
    placeholder=""
    onChangeText={() => {...}}/>
- <Button
    onPress={() => {...}}
    title=""/>
- <TouchableHighlight
    style={{...}},
    onPress={() => {...}}
    onLongPressButton={() => {...}}
    underlayColor=""
    background={ Platform.OS === ... }></TouchableHighlight>
- <ScrollView></ScrollView> // whole page is rendered, good for finite and small lists
- <FlatList                 // renders only the elements that are on the screen
    data={[
      {key: ''},
      {key: ''},
      {key: ''},
      ...
    ]}
    renderItem={({item}) => <Text style={...}></Text>}/>
- <SectionList
    sections={[
      {title: '', data: ['', '', ...]},
      {title: '', data: ['', '', ...]},
      {title: '', data: ['', '', ...]},
      ...
    ]}
    renderItem={({item}) => <Text style={...}></Text>
    renderSectionHeader={({section}) => <Text style={...}></Text>}
    keyExtractor={(item, index) => index}/>

# Attributes
- Block Elements
  - width
  - height
  - color
  - backgroundColor
  - flex
  - flexDirection
  - justifyContent
  - alignItems
  - padding
  - fontSize
- InLine Elements
  - font
  - fontFamily
  - fontSize
