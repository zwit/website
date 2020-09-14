import React from 'react';
import Content from './common/Content';
import cssGradients from '../utils/cssGradients';

const CssBackgrounds = () => (
  <div>
    <Content>
      {cssGradients.map(cssGradient => 
        <div style={{
          width: '100vw', 
          height: 200,
          float: 'left',
          position: 'relative',
          borderBottom: '1px solid white',
          ...cssGradient.css,
        }}>
          <div style={{
            margin: 0,
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            color: 'white',
            textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black',
          }}>
            {cssGradient.title || ''}
          </div>
        </div>
      )}
    </Content>
  </div>
)

export default CssBackgrounds;
