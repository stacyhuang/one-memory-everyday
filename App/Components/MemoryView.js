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

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

class MemoryView extends Component {
  footer() {
    return (
      <View style={styles.footerContainer}>
        <TouchableHighlight
          style={styles.footerButton}
          underlayColor='#88D4F5'>
            <Icon name="share" style={styles.footerButtonText}/>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    let image = this.props.memory.type === 'photo' ? <Image source={{uri: this.props.memory.image_url}} style={styles.photo} /> : <View></View>;
    let date = moment(this.props.memory.date).format('MMMM DD, YYYY');

    return (
      <View style={styles.container}>
        <ScrollView>
          {image}
          <View style={styles.containerBottom}>
            <Text style={styles.dateContainer}>{date}</Text>
            <Text style={styles.noteContainer}>{this.props.memory.text}</Text>
          </View>
        </ScrollView>
        {this.footer()}
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: ScreenHeight,
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
  },
  footerContainer: {
    backgroundColor: '#272727',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  footerButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerButtonText: {
    fontSize: 24, // size of icon
    color: 'white'
  }
});

module.exports = MemoryView;
