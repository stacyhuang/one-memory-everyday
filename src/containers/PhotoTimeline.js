import React, {
  Component,
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as memoryActions from '../actions/memoryActions';
import Grid from '../components/Grid';

class PhotoTimeline extends Component {
  render() {
    return (
      <Grid {...this.props}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PhotoTimeline);
