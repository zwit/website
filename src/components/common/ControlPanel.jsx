import React, {PureComponent} from 'react';
import area from '@turf/area';

export default class ControlPanel extends PureComponent {
  render() {
    const polygon = this.props.polygon;
    const polygonArea = polygon && area(polygon);
    return (
      <div className="control-panel">
        <h3>Draw Polygon</h3>
        {polygon && (
          <p>
            {polygonArea} <br />
            square meters
          </p>
        )}
      </div>
    );
  }
}