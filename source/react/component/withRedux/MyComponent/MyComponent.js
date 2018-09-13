import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MyComponent.css';

class MyComponent extends Component {

  render() {
    return (
      <div className="MyComponent">

      </div>
    );
  }

}

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
