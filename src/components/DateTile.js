import React, {
  Component,
  Text,
  StyleSheet,
  PropTypes
} from 'react-native';

import moment from 'moment';

class DateTile extends Component {
  render() {
    let date = moment(this.props.date).format('MMMM DD');

    return (
      <Text style={styles.container}>{date}</Text>
    )
  }
}

DateTile.propTypes = {
  date: PropTypes.string.isRequired
};

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#48BBEC',
    textAlign: 'center',
    width: 75,
    height: 75,
    padding: 8,
    paddingTop: 14, // Todo: use flexbox to vertically align intead of brute force
    lineHeight: 22, // Todo: use flexbox to vertically align intead of brute force
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 5
  }
});

module.exports = DateTile;
