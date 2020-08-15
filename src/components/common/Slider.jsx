import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import backgroundMedieval from '../../images/background-medieval.png';
import SimpleCard from './SimpleCard';
import { makeStyles } from '@material-ui/core/styles';
import { animated, useSpring } from "react-spring";
import { useScroll } from "react-use-gesture";
import './Slider.scss';

const Slider = ({ deleteEntity, entityList, postEntity, selectEntity, selectedEntity }) => {
  const [style, set] = useSpring(() => ({
    transform: "perspective(500px) rotateY(0deg)"
  }));

  const bind = useScroll(event => {
    set({
      transform: `perspective(500px) rotateY(${
        event.scrolling ? event.delta[0] / 3 : 0
      }deg)`
    });
  });
  
  const classes = useStyles();

  return (
    <div className={classes.content} id="slider">
      <div className={classes.slider} {...bind()}>
        {entityList && entityList.map((entity) => (
          <animated.div style={{
            ...style,
          }}><SimpleCard
            className={cx(classes.card, {
            'selected': selectedEntity && selectedEntity.get('id') === entity.get('id'),
            })}
            onClick={() => selectEntity(entity)}
            onDelete={deleteEntity}
            category={entity.set('image', backgroundMedieval)}
          /></animated.div>
        ))}

        <SimpleCard
          className={classes.card}
          onSave={postEntity}
          isEditingProp={true}
          category={Map({ title: '', description: '', image: backgroundMedieval })}
        />
        </div>
    </div>
  );
}

const useStyles = makeStyles({
  content: {
  },
  slider: {
    display: 'flex',
    overflowX: 'scroll',
    width: '100%',
    paddingBottom: '20px',
    marginBottom: '-20px',

    '&::after': {
      right: '0',
      backgroundImage: 'linear-gradient(to left,#f8f8f8,rgba(248,248,248,0))',
      content: '""',
      position: 'absolute',
      zIndex: '2',
      height: '345px',
      width: '70px',
    },

    '&::before': {
      left: '0',
      backgroundImage: 'linear-gradient(to right,#f8f8f8,rgba(248,248,248,0))',
      content: '""',
      position: 'absolute',
      zIndex: '2',
      height: '345px',
      width: '70px',
    }
  },
  card: {
    flexShrink: '0',
    marginLeft: '20px',
    marginTop: '20px',
    minWidth: '300px',
    width: '300px',
    boxShadow: 'none !important',

    '&.selected': {
      color: 'orange',
    }
  }
});

Slider.propTypes = {
  entityList: PropTypes.string.isRequired,
  selectEntity: PropTypes.func.isRequired,
  deleteEntity: PropTypes.func.isRequired,
  postEntity: PropTypes.func.isRequired,
};

export default Slider;
