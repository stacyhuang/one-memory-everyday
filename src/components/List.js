import React, {
  Component,
  Text,
  View,
  Image,
  StyleSheet,
  ListView,
  TouchableHighlight
} from 'react-native';

import Swipeout from 'react-native-swipeout';
import Memory from './Memory';
import DateTile from './DateTile';
import ImageTile from './ImageTile';
import Separator from './Helpers/Separator';
import RNFS from 'react-native-fs';

let imageDirPath = RNFS.DocumentDirectoryPath + '/images/';

class List extends Component {
  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
  }

  deleteMemory(id) {
    this.props.actions.deleteFromDB(id);
  }

  _navigate(memory) {
    this.props.navigator.push({
      component: Memory,
      passProps: {
        memory: memory
      }
    })
  }

  renderRow(rowData, sectionID, rowID) {
    let image = rowData.image_url ? <Image source={{uri: imageDirPath + rowData.image_url}} style={styles.imageContainer} /> : <View></View>;

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
          onPress={this._navigate.bind(this, rowData)}
          underlayColor='#F8F8F8'>
          <View style={styles.rowContainer}>
            {image}
            <View style={[styles.rowContainerRight, rowData.memory_type === 'photo' && styles.rowContainerRightWithPhoto]}>
              <Text style={styles.noteContainer}>{rowData.text}</Text>
              <DateTile date={rowData.date}/>
            </View>
          </View>
        </TouchableHighlight>
        <Separator />
      </Swipeout>
    )
  }

  render() {
    const dataSource = this.dataSource.cloneWithRows(this.props.memory);

    return (
      <ListView
        style={styles.container}
        automaticallyAdjustContentInsets={false}
        dataSource={dataSource}
        renderRow={this.renderRow.bind(this)} />
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
    marginBottom: 49
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    height: 95, // photo height + top and bottom paddings
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
  imageContainer: {
    width: 75,
    height: 75,
    position: 'absolute',
  }
});

module.exports = List;
