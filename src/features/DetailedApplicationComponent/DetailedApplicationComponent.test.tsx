import React from 'react';
import ReactDOM from 'react-dom';
import DetailedApplicationComponent from './DetailedApplicationComponent';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DetailedApplicationComponent />, div);
  ReactDOM.unmountComponentAtNode(div);
});