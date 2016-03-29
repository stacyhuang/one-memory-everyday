import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
} from 'react-native';

import Main from './App/Components/Main';

class OneMemoryEveryday extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'One Memory Everyday',
          component: Main
        }} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

AppRegistry.registerComponent('OneMemoryEveryday', () => OneMemoryEveryday);
