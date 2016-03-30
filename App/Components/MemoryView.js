import React, {
  Component,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNFS from 'react-native-fs';

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
let imageDirPath = RNFS.DocumentDirectoryPath + '/images/';

class MemoryView extends Component {
  render() {
    let image = this.props.memory.type === 'photo' ? <Image source={{uri: imageDirPath + this.props.memory.image_url}} style={styles.photo} /> : <View></View>;
    let date = moment(this.props.memory.date).format('MMMM DD, YYYY');

    return (
      <ScrollView
        style={styles.container}
        automaticallyAdjustContentInsets={false}>
        {image}
        <View style={styles.containerBottom}>
          <Text style={styles.dateContainer}>{date}</Text>
          <Text style={styles.noteContainer}>{this.props.memory.text}</Text>
        </View>
      </ScrollView>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 64,
    marginBottom: 49
  },
  photo: {
    height: ScreenWidth
  },
  containerBottom: {
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  dateContainer: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CCCBC6',
    marginBottom: 5
  },
  noteContainer: {
    fontSize: 20,
  }
});

module.exports = MemoryView;
