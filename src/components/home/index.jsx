import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CardActionArea, Card, CardMedia, Typography, CardContent } from '@material-ui/core';
import backgroundMedieval from '../../images/background-medieval.png';
import matrix from '../../images/matrix.png';
import tintin from '../../images/tintin.png';
import eratosthene from '../../images/eratosthene.png';

const Home = () => (
  <div>
    <Link to="/history">
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
              History
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              History category
            </Typography>
          </CardContent>
        </CardActionArea>
      </StyledCard>
    </Link>

    <Link to="/lang">
      <StyledCard>
        <CardActionArea>
          <CardMedia
            component="img"
            alt="Lang"
            height="140"
            image={tintin}
            title={"Lang"}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Lang
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Lang category
            </Typography>
          </CardContent>
        </CardActionArea>
      </StyledCard>
    </Link>

    <Link to="/science">
      <StyledCard>
        <CardActionArea>
          <CardMedia
            component="img"
            alt="Science"
            height="140"
            image={eratosthene}
            title={"Science"}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Science
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
            Science category
            </Typography>
          </CardContent>
        </CardActionArea>
      </StyledCard>
    </Link>

    <Link to="/crypto">
      <StyledCard>
        <CardActionArea>
          <CardMedia
            component="img"
            alt="Crypto"
            height="140"
            image={matrix}
            title={"Crypto"}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
            Crypto
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
            Crypto category
            </Typography>
          </CardContent>
        </CardActionArea>
      </StyledCard>
    </Link>
  </div>
)

const StyledCard = styled(Card)`
  display: inline-block;
  margin-left: 20px;
  margin-top: 20px;
  max-width: 300px;
`;

export default Home;