import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import cx from 'classnames';
import MapBoxGl from './MapBoxGl';
import bbox from '@turf/bbox';
import {Editor, DrawPolygonMode, DrawLineStringMode, DirectSelectMode, SimpleSelectMode, DrawPointMode, EditingMode, RENDER_STATE} from 'react-map-gl-draw';
import MapGL, { Marker, Layer, Popup, Feature, Source, WebMercatorViewport, LinearInterpolator } from 'react-map-gl';
import TimelineIcon from '@material-ui/icons/Timeline';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DeleteIcon from '@material-ui/icons/Delete';
import ControlPanel from './ControlPanel';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibnVteSIsImEiOiJja2Vmc2c4eHgwdGJnMnFuN3NnYmUwdWdwIn0.RN4cGa2_56cvYD47hRUctA';
 
var modelTransform = {
  translateX: 148.9819,
  translateY: -35.39847,
  translateZ: 0,
  rotateX: Math.PI / 2,
  rotateY: 0,
  rotateZ: 0,
  scale: 1
};
 
var THREE = window.THREE;

class MapGLContainer extends React.Component {
  constructor(props) {
    super(props);

    this._editorRef = null;
    this.state = {
      viewport: {
        latitude: 34,
        longitude: 5,
        zoom: 1.5,
        bearing: 0,
        pitch: 0
      },
      mode: null,
      selectedFeatureIndex: null,
      hoverInfo: null,
      selectedFeature: null,
    }

    this.onViewportChange = this.onViewportChange.bind(this);
    this.onHover = this.onHover.bind(this);
    // this.onLoad = this.onLoad.bind(this);
    this._map = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { editMode } = this.props;

    if (editMode !== prevProps.editMode) {
      this.setState({ mode: editMode ? new EditingMode() : null })
    }
  }

  _onClick = event => {
    const feature = event.features[0];
    const { onClick } = this.props;

    if (feature && feature.properties.name) {
      // calculate the bounding box of the feature
      const [minLng, minLat, maxLng, maxLat] = bbox(feature);
      // construct a viewport instance from the current state
      const viewport = new WebMercatorViewport(this.state.viewport);
      const {longitude, latitude, zoom} = viewport.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
        padding: 150
      });

      this.setState({
        viewport: {
          ...this.state.viewport,
          longitude,
          latitude,
          zoom,
          transitionInterpolator: new LinearInterpolator({
            around: [event.offsetCenter.x, event.offsetCenter.y]
          }),
          transitionDuration: 1000
        },
        selectedFeature: feature,
      });

      onClick(feature);
    } else {
      this.setState({
        selectedFeature: null,
      });

      onClick(null);
    }

    this._map.current.getMap()["keyboard"].disable();
  };

  _updateViewport = viewport => {
    this.setState({viewport});
  };

  _onSelect = options => {
    this.setState({selectedFeatureIndex: options && options.selectedFeatureIndex});
  };

  _onDelete = () => {
    const selectedIndex = this.state.selectedFeatureIndex;
    if (selectedIndex !== null && selectedIndex >= 0) {
      this._editorRef.deleteFeatures(selectedIndex);
    }
  };

  _onUpdate = ({editType}) => {
    if (editType === 'addFeature') {
      this.setState({
        mode: new EditingMode()
      });
    }
  };

  _renderControlPanel = () => {
    const features = this._editorRef && this._editorRef.getFeatures();
    let featureIndex = this.state.selectedFeatureIndex;
    if (features && featureIndex === null) {
      featureIndex = features.length - 1;
    }
    const polygon = features && features.length ? features[featureIndex] : null;
    return <ControlPanel containerComponent={this.props.containerComponent} polygon={polygon} />;
  };

  onViewportChange(viewport) {
    this.setState({viewport})
  }

  onHover(event) {
    const {
      featuresEvent
    } = event;
    const hoveredFeature = featuresEvent && featuresEvent.find(f => f.layer.id === 'data');

    let hoverInfo = null;

    const feature = event.features && event.features[0];
    if (feature && feature.properties.name && feature.properties.color) {
      hoverInfo = {
        lngLat: event.lngLat,
        feature
      };
    }

    this.setState({
      hoveredFeature,
      hoverInfo,
    });
  }

  componentDidMount() {
    console.log(this._map.current.getMap().getZoom());

    this._map.current.getMap()["keyboard"].disable();
  }

  render() {
    const { viewport, mode, selectedFeatureIndex, hoverInfo, selectedFeature } = this.state;
    const { classes, features, editMode, points } = this.props;

    return (
      <div className={cx(classes.container, { cursor : editMode ? (mode ? 'cell' : 'pointer') : 'grab'})}>
        <MapGL
            ref={this._map}
            {...viewport}
            className={cx({ cursor : editMode ? (mode ? 'cell' : 'pointer') : 'grab'})}
            antialias
            width={'100%'}
            height={'100%'}
            mapStyle="mapbox://styles/numy/ckezv00o013ea19o4l4sa40yo"
            onViewportChange={this.onViewportChange}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            onHover={this.onHover}
            onClick={this._onClick}
            onStyleLoad={ el => this.map = el }
            // onLoad={this.onLoad}
          >
            {
              this._map.current && this._map.current.getMap() && 
              this._map.current.getMap().getZoom() > 4 && 
              points.slice(0, 500).map((point, index) => 
                <Marker
                  key={point.properties.title + parseInt(index)}
                  longitude={point.geometry.coordinates[0]}
                  latitude={point.geometry.coordinates[1]}
                  captureDrag={false}
                  captureDoubleClick={false}
                >
                  <div className={classes.marker}>
                    <span>{point.properties.title}</span>
                  </div>
                </Marker>
              )
            }
            <Source
              type="geojson"
              data={{
                type: "FeatureCollection", 
                "features": features.features
                  .filter(feature => (hoverInfo && feature.properties.name === hoverInfo.feature.properties.name))
              }}
            >
              <Layer
                id='dataouterlines'
                type='line'
                style={{cursor : 'pointer'}}
                paint={{
                  'line-width': [
                    'step', 
                    ['zoom'],
                    2,
                    0, 2,
                    3, 2,
                    4, 1,
                    5, 0,
                  ],
                  'line-color': 'black',
                }}
              />
              <Layer
                id='datas'
                type='fill'
                style={{cursor : 'pointer'}}
                paint={{
                  'fill-color': {
                    type: 'identity',
                    property: 'color',
                  },
                  'fill-opacity': [
                    'step', 
                    ['zoom'],
                    0.8,
                    0, 0.8,
                    3, 0.8,
                    4, 0.5,
                    5, 0.3,
                  ],
                }}
              />
            </Source>
            <Source
              type="geojson"
              data={{
                type: "FeatureCollection", 
                "features": features.features
                  .filter(feature => (hoverInfo && feature.properties.name !== hoverInfo.feature.properties.name || !hoverInfo))
              }}
            >
              <Layer
                id='dataouterline'
                type='line'
                style={{cursor : 'pointer'}}
                paint={{
                  'line-width': [
                    'step', 
                    ['zoom'],
                    2,
                    0, 2,
                    3, 2,
                    4, 1,
                    5, 0,
                  ],
                  'line-color': 'black',
                }}
              />
              <Layer
                id='data'
                type='fill'
                style={{cursor : 'pointer'}}
                paint={{
                  'fill-color': {
                    type: 'identity',
                    property: 'color',
                  },
                  'fill-opacity': [
                    'step', 
                    ['zoom'],
                    0.5,
                    0, 1,
                    3, 0.5,
                    4, 0.3,
                    5, 0.2,
                  ],
                }}
              />
              <Editor
                ref={_ => (this._editorRef = _)}
                features={!editMode ? 
                  [] : 
                  features.features
                    .map(feature => { 
                      return feature.geometry.coordinates.flat().map((subFeature, index) => { 
                        return {
                          id: feature.id + parseInt(index),
                          type: feature.type,
                          properties: feature.properties,
                          geometry: {
                            type: "Polygon",
                            coordinates: [subFeature]
                          },
                        }
                      })
                    })
                    .flat()
                }
                style={{width: '100%', height: '100%'}}
                clickRadius={12}
                mode={mode}
                onSelect={this._onSelect}
                onUpdate={this._onUpdate}
                editHandleShape={'circle'}
                featureStyle={({feature, index, state}) => {
                  switch (state) {
                    case RENDER_STATE.SELECTED:
                    case RENDER_STATE.HOVERED:
                    case RENDER_STATE.UNCOMMITTED:
                    case RENDER_STATE.CLOSING:
                      return {
                        stroke: 'rgb(251, 176, 59)',
                        strokeWidth: 2,
                        fill: 'rgb(251, 176, 59)',
                        fillOpacity: 0.3,
                        strokeDasharray: '4,2'
                      };
                
                    default:
                      return {
                        // stroke: 'rgb(0, 0, 0)',
                        // strokeWidth: 2,
                        fill: 'rgb(60, 178, 208)',
                        fillOpacity: 0.0
                      };
                  }
                }}
                editHandleStyle={({feature, state}) => {
                  switch (state) {
                    case RENDER_STATE.SELECTED:
                    case RENDER_STATE.HOVERED:
                    case RENDER_STATE.UNCOMMITTED:
                      return {
                        fill: 'rgb(251, 176, 59)',
                        fillOpacity: 1,
                        stroke: 'rgb(255, 255, 255)',
                        strokeWidth: 2,
                        r: 7
                      };
                
                    default:
                      return {
                        fill: 'rgb(251, 176, 59)',
                        fillOpacity: 1,
                        stroke: 'rgb(255, 255, 255)',
                        strokeWidth: 2,
                        r: 5
                      };
                  }
                }}
              />
              {/* <Layer
                id='3d'
                type='custom'
                renderingMode='3d'
                onAdd={(map, gl) => {
                  this.camera = new THREE.Camera();
                  this.scene = new THREE.Scene();
                   
                  // create two three.js lights to illuminate the model
                  var directionalLight = new THREE.DirectionalLight(0xffffff);
                  directionalLight.position.set(0, -70, 100).normalize();
                  this.scene.add(directionalLight);
                   
                  var directionalLight2 = new THREE.DirectionalLight(0xffffff);
                  directionalLight2.position.set(0, 70, 100).normalize();
                  this.scene.add(directionalLight2);
                   
                  // use the three.js GLTF loader to add the 3D model to the three.js scene
                  var loader = new THREE.GLTFLoader();
                  loader.load(
                  'https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf',
                  function (gltf) {
                  this.scene.add(gltf.scene);
                  }.bind(this)
                  );
                  this.map = map;
                   
                  // use the Mapbox GL JS map canvas for three.js
                  this.renderer = new THREE.WebGLRenderer({
                  canvas: map.getCanvas(),
                  context: gl,
                  antialias: true
                  });
                   
                  this.renderer.autoClear = false;
                  }}
                  render={(gl, matrix) => {
                    var rotationX = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(1, 0, 0),
                    modelTransform.rotateX
                    );
                    var rotationY = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(0, 1, 0),
                    modelTransform.rotateY
                    );
                    var rotationZ = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(0, 0, 1),
                    modelTransform.rotateZ
                    );
                     
                    var m = new THREE.Matrix4().fromArray(matrix);
                    var l = new THREE.Matrix4()
                    .makeTranslation(
                    modelTransform.translateX,
                    modelTransform.translateY,
                    modelTransform.translateZ
                    )
                    .scale(
                    new THREE.Vector3(
                    modelTransform.scale,
                    -modelTransform.scale,
                    modelTransform.scale
                    )
                    )
                    .multiply(rotationX)
                    .multiply(rotationY)
                    .multiply(rotationZ);
                     
                    this.camera.projectionMatrix = m.multiply(l);
                    // this.renderer.state.reset();
                    // this.renderer.render(this.scene, this.camera);
                    this._map.current.getMap().triggerRepaint();
                    }}
              /> */}
            </Source>
            {editMode && <div className={classes.drawTools}>
              <CropFreeIcon
                className={cx(classes.drawIcon, mode instanceof DrawPolygonMode ? classes.drawIconOn : null)}
                fontSize='large'
                title="Polygon tool (p)"
                onClick={() => this.setState({mode: new DrawPolygonMode()})}
              />
              <AddCircleIcon
                className={cx(classes.drawIcon)}
                fontSize='large'
                title="Point tool (p)"
                onClick={() => this.setState({mode: new DrawPointMode()})}
              />
              <TimelineIcon
                className={cx(classes.drawIcon, mode instanceof DrawLineStringMode ? classes.drawIconOn : null)}
                fontSize='large'
                title="Draw line string tool (p)"
                onClick={() => this.setState({mode: new DrawLineStringMode()})}
              />
              <TimelineIcon
                className={cx(classes.drawIcon, mode instanceof DrawPointMode ? classes.drawIconOn : null)}
                fontSize='large'
                title="Draw line string tool (p)"
                onClick={() => this.setState({mode: new DrawPointMode()})}
              />
              <DeleteIcon
                className={cx(classes.drawIcon, selectedFeatureIndex ? classes.drawIconOn : null)}
                fontSize='large'
                title="Delete"
                onClick={this._onDelete}
              />
            </div>}
            {hoverInfo && <Popup longitude={hoverInfo.lngLat[0]} latitude={hoverInfo.lngLat[1]} closeButton={false}>
              <div className="county-info">{hoverInfo.feature.properties.name}</div>
            </Popup>}
            {this._renderControlPanel()}
          </MapGL>
      </div>
    );
  }
}

const styles = theme => ({
  container: {
    // display: 'flex',
    height: '100vh',
    width: '100vw',
    // flex-wrap: nowrap;
  },
  drawTools: {
    top: 120,
    right: 20,
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 2,
    width: 30,
    clear: 'both',
    pointerEvents: 'auto',
    transform: 'translate(0)',
  },
  drawIcon: {
    zIndex: 10,
    width: 29,
    height: 29,
    display: 'block',
    padding: 0,
    outline: 'none',
    border: 0,
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  drawIconOn: {
    color: 'white',
  },
  marker: {
    borderRadius: 20,
    padding: 3,
    paddingRight: 12,
    marginTop: -3,
    marginLeft: -3,
    color: 'transparent',
    fontSize: 13,
    whiteSpace: 'nowrap',

    "&:before": {
      content: '" "',
      display: 'inline-block',
      width: 8,
      height: 8,
      background: 'red',
      borderRadius: 8,
      margin: '0 8px',
    },  
    "& span": {
      display: 'none',
    },
    "&:hover": {
      background: 'rgba(0,0,0,0.8)',
      color: "#fff",
    },
    "&:hover span": {
      display: 'inline-block',
    }
  }
});

MapGLContainer.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(MapGLContainer);