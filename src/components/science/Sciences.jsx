import React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import styled from 'styled-components';
import { CardActionArea, Card, CardMedia, Typography, CardContent, TextField, FormControlLabel, Switch, Button, ButtonGroup } from '@material-ui/core';
import backgroundMedieval from '../../images/background-medieval.png';

export default class Sciences extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bookList: ['A la decouverte des lois de l\'univers', 'Minimum théorique', 'Immuno Janis Kuby', 'Histoire de l\'art', 'Arabic'],
    }
  }

  render() {
    const {
      bookList,
    } = this.state;

    return (
      <div>
        <Sliders>
          <ArrowForwardIosIconStyled/>
          <ArrowBackIosIconStyled/>
          {bookList.map((language) => (
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
                    {language} book
                  </Typography>
                </CardContent>
              </CardActionArea>
            </StyledCard>
          ))}
        </Sliders>
      </div>
    );
  }
}

const Sliders = styled.div`
  overflow: hidden;
  display: flex;
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
  margin-left: 20px;
  margin-top: 20px;
  min-width: 300px;

  box-shadow: none !important;
`;

Sciences.propTypes = {
};
