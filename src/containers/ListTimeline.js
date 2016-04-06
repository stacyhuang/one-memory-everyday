import React, {
  Component,
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as memoryActions from '../actions/memoryActions';
import List from '../components/List';

class ListTimeline extends Component {
  componentWillMount() {
    this.props.actions.fetchFromDB();
    // DB.memories.destroy();
  }
  
  render() {
    return (
      <List {...this.props} />
    )
  }
}


const mapStateToProps = (state) => {
  return {
    memory: state.memory
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(memoryActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListTimeline);
