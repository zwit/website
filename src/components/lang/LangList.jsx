import React from 'react';
import PropTypes from 'prop-types';
import { CardActionArea, Card, CardMedia, Typography, CardContent } from '@material-ui/core';
import styled from 'styled-components';
import backgroundMedieval from '../../images/background-medieval.png';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Slider from './netflixSlider'

export default class LangList extends React.Component {
  constructor(props) {
    super(props);

    this.setSelectedAddress = this.setSelectedAddress.bind(this);

    this.state = {
      languageList: ['Chinese', 'Japanese', 'Russian', 'Italian', 'Arabic', 'Turkish'],
      movies: [
        {
          id: 1,
          image: '/images/slide1.jpg',
          imageBg: '/images/slide1b.webp',
          title: '1983'
        },
        {
          id: 2,
          image: '/images/slide2.jpg',
          imageBg: '/images/slide2b.webp',
          title: 'Russian doll'
        },
        {
          id: 3,
          image: '/images/slide3.jpg',
          imageBg: '/images/slide3b.webp',
          title: 'The rain',
        },
        {
          id: 4,
          image: '/images/slide4.jpg',
          imageBg: '/images/slide4b.webp',
          title: 'Sex education'
        },
        {
          id: 5,
          image: '/images/slide5.jpg',
          imageBg: '/images/slide5b.webp',
          title: 'Elite'
        },
        {
          id: 6,
          image: '/images/slide6.jpg',
          imageBg: '/images/slide6b.webp',
          title: 'Black mirror'
        }
      ]
    }
  }

  componentDidMount() {
  }


  setSelectedAddress(selectedAddress) {
    this.setState({ selectedAddress });
  }

  render() {
    const {
      languageList,
      movies,
    } = this.state;

    return (
      <div>
        <Slider>
          {movies.map(movie => (
            <Slider.Item movie={movie} key={movie.id}>item1</Slider.Item>
          ))}
        </Slider>
        <Sliders>
          <ArrowForwardIosIconStyled/>
          <ArrowBackIosIconStyled/>
          {languageList.map((language) => (
            <StyledCard>
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt="History"
                  height="140"
                  image={backgroundMedieval}
                  title={"History"}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {language}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {language} language
                  </Typography>
                </CardContent>
              </CardActionArea>
            </StyledCard>
          ))}
        </Sliders>
      </div>
    )
  }
}

const Sliders = styled.div`
  display: none;
  overflow: hidden;
  height: 260px;
  margin-left: 30px;
  margin-right: 30px;
`;

const ArrowForwardIosIconStyled = styled(ArrowForwardIosIcon)`
  right: 0;
  position absolute;
  transition: opacity .4s ease,transform .4s ease;
  display: flex;
`;

const ArrowBackIosIconStyled = styled(ArrowBackIosIcon)`
  left: 0;
`;

const StyledCard = styled(Card)`
  display: inline-block;
  margin-left: 20px;
  margin-top: 20px;
  max-width: 300px;
`;

LangList.propTypes = {
};