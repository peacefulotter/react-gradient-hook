const React = require('react');

const defaultStyle = {
  background: '#FDFEFD',
  width: '90%',
  textAlign: 'center',
  margin: '30px auto 10px auto',
};

const DisplayDemo = window.DisplayDemo = ({ style, ...props }) => (
  React.createElement('div', { style: { ...defaultStyle, ...style } }, props.children)
);