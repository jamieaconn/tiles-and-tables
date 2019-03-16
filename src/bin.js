import React from 'react'
import Number from './number.js'

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
}

class Bin extends React.Component {
  renderNumber() {
    return (
      <Number value={this.props.value}/>
    )
  }

  render() {
    return (
      <div style={style}>
        {this.renderNumber(this.props.value)}
      </div>
    );
  }
}


export default Bin

