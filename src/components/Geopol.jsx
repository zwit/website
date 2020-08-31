import React from 'react';
import TimeLineComponent from './common/TimeLineComponent';
import Content from './common/Content';

const History = () => (
  <div>
    <Content displayHeader={false} absolute>
      <TimeLineComponent 
        type='history' 
        displaySlider={false} 
        displayMap
      />
    </Content>
  </div>
)

export default History;
