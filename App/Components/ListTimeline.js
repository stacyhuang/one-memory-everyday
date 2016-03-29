import React, {
  Component,
  Text,
  View,
  Image,
  StyleSheet,
  ListView,
  TouchableHighlight,
} from 'react-native';

import moment from 'moment';
import Swipeout from 'react-native-swipeout';
import RNFS from 'react-native-fs';
import MemoryView from './MemoryView';
import Separator from './Helpers/Separator';
import DB from '../Utils/db';

let imageDirPath = RNFS.DocumentDirectoryPath + '/images/';

class ListTimeline extends Component {
  deleteMemory(id) {
    DB.memories.removeById(id)
      .then((res) => {
        this.props.getMemories();
      })
  }

  routeToMemory(memory) {
    this.props.navigator.push({
      title: 'One Memory Everyday',
      component: MemoryView,
      leftButtonTitle: 'Back',
      onLeftButtonPress: () => this.props.navigator.pop(),
      passProps: {
        memory: memory
      }
    });
  }

  renderRow(rowData, sectionID, rowID) {
    let image = rowData.image_url ? <Image source={{uri: imageDirPath + rowData.image_url}} style={styles.photo} /> : <View></View>;
    let date = moment(rowData.date).format('MMMM DD');

    let swipeBtns = [{
      text: 'Delete',
      backgroundColor: 'red',
      underlayColor: '#F8F8F8',
      onPress: () => { this.deleteMemory(rowData._id) }
    }];

    return (
      <Swipeout right={swipeBtns}
        autoClose='true'
        backgroundColor='transparent'>
        <TouchableHighlight
          onPress={this.routeToMemory.bind(this, rowData)}
          underlayColor='#F8F8F8'>
          <View style={styles.rowContainer}>
            {image}
            <View style={[styles.rowContainerRight, rowData.type === 'photo' && styles.rowContainerRightWithPhoto]}>
              <Text style={styles.noteContainer}>{rowData.text}</Text>
              <Text style={styles.dateContainter}>{date}</Text>
            </View>
          </View>
        </TouchableHighlight>
        <Separator />
      </Swipeout>
    )
  }

  render() {
    return (
      <ListView
        style={styles.container}
        automaticallyAdjustContentInsets={false}
        dataSource={this.props.dataSource}
        renderRow={this.renderRow.bind(this)} />
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    height: 95, // photo height + top and bottom paddings
  },
  photo: {
    width: 75,
    height: 75,
    position: 'absolute',
    top: 10 // container top padding
  },
  rowContainerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowContainerRightWithPhoto: {
    marginLeft: 85 // photo width + margin of 10
  },
  noteContainer: {
    flex: 1,
    color: '#494949',
    fontSize: 16,
    lineHeight: 22
  },
  dateContainter: {
    backgroundColor: '#48BBEC',
    textAlign: 'center',
    width: 75,
    height: 75,
    padding: 5,
    paddingTop: 14, // Todo: use flexbox to vertically align intead of brute force
    lineHeight: 22, // Todo: use flexbox to vertically align intead of brute force
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 5
  }
});

module.exports = ListTimeline;
