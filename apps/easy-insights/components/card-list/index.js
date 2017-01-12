import React from 'react';
import _ from 'lodash';
import LoadingCard from '../loading-card';
import DemographicsCard from '../demographics-card';
import InterestsCard from '../interests-card';
import HashtagsCard from '../hashtags-card';
import InfluencersCard from '../influencers-card';
import WordsCard from '../words-card';
import VolumeSentimentCard from '../volume-sentiment-card';
import RetweetsCard from '../retweets-card';
import {rem2px} from '../../utils/utils';
import {Responsive as GridLayout} from 'react-grid-layout';

require('./card-list.scss');

const NUM_CARDS           = 7;
const DEFAULT_CARD_HEIGHT = 300;
const GRID_GUTTER         = rem2px(1);
const COLUMN_JUMP_DELTA   = 50;

export default class CardList extends React.Component {

    breakpoints = {xl: Infinity, lg: 1200, md: 996, sm: 768, xs: 480, xxs : 0};
    cols        = {xl: 4, lg: 3, md: 2, sm: 2, xs: 1, xxs: 1};
    didInit     = false;

    constructor(props) {
      super(props);
      let sortedCards = this.sortCards(props.cards);
      this.state = {
        sortedCards: sortedCards,
        cardHeights: _.clone(props.cardHeights),
        layouts: this.createLayouts(sortedCards),
        width : window.innerWidth - rem2px(2) // set initial width
      };
    }

    componentDidMount() {
      this.handleResize = this.handleResize.bind(this);
      window.addEventListener('resize', this.handleResize);
      this.setState({width : this.refs.mainElemRef.offsetWidth - 1});
      this.setState({width : this.refs.mainElemRef.offsetWidth - 1});
      this.didInit = true;
    }

    componentWillUnmount() {
  		window.removeEventListener('resize', this.handleResize);
  	}

  	handleResize() {
  		this.resizing && clearTimeout(this.resizing);
  		this.resizing = setTimeout(() => {
  			this.setState({width: this.refs.mainElemRef.offsetWidth - 1});
  		}, 300);
    }

    sortCards(cards) {
      let result = _.sortBy(cards, 'rank');
      return result.concat(Array(NUM_CARDS - cards.length).fill({id: 'loading'}));
    }

    shouldComponentUpdate(newProps, newState) {
      if (this.layoutUpdated) {
        this.layoutUpdated = false;
        return true;
      }
      if (newProps.cards.length != this.props.cards.length) {
        return true;
      }
      if (newState.width != this.state.width) {
        return true;
      }
      return false;
    }

    componentWillReceiveProps(nextProps) {
      let cards = this.sortCards(nextProps.cards);
      let state = { sortedCards : cards };

      if (!_.isEqual(nextProps.cardHeights, this.state.cardHeights))  {
        state.layouts      = this.createLayouts(cards);
        state.cardHeights  = _.clone(nextProps.cardHeights);
        this.layoutUpdated = true;
      }
      this.didInit && this.setState(state);
    }

    createLayouts(cardArray) {
      let layouts = {};
      for (let brkP in this.cols) {
        layouts[brkP] = this.createLayout(cardArray, this.cols[brkP]);
      }
      return layouts;
    }

    getCardheight(cardId) {
      let cHeights = this.props.cardHeights;
      let h = cHeights[cardId] ? cHeights[cardId] : DEFAULT_CARD_HEIGHT;
      return h + GRID_GUTTER;
    }

    createLayout(cardArray, numCols) {
      let col = 0;
      let row = 0;
      let colHeights = Array(numCols).fill(0);

      let layout = cardArray.map( (c, i) => {

        // re-arrange item if a column is significantly shorter than the others
        let cardH = this.getCardheight(c.id);

        if (numCols > 1 && i >= numCols) {
          let currColH    = colHeights[col];
          let currFutureH = currColH + cardH;

          for (let n=1; n < numCols; n++) {
            let nextColH = colHeights[(col + n) % numCols];
            if (currFutureH - nextColH > (cardH + COLUMN_JUMP_DELTA)) {
              col += n;
              col = col % numCols;
              if (col == 0 && n != 1) row++;
              break;
            }
          }
        }

        colHeights[col] += cardH;
        let item = {
          x : col,
          y : row,
          w : 1,
          h : cardH,
          i : i.toString()
        };

        col++;
        col = col % numCols;
        if (col == 0) row++;
        return item;
      });
      //numCols == 2 && console.log('layout', layout.map( i => _.clone(i)));
      return layout;
    }

    prepCards() {
      let newDisplayCards = [];
      let sortedCards = this.state.sortedCards;

      if(sortedCards.length > 0 ) {
          sortedCards.map( (card, i) => {
            switch(card.id){
                case 'demographics':
                    newDisplayCards.push(<DemographicsCard card={card} />);
                    break;
                case 'hashtags':
                    newDisplayCards.push(<HashtagsCard card={card} />);
                    break;
                case 'interests':
                    newDisplayCards.push(<InterestsCard card={card} />);
                    break;
                case 'topInfluencers':
                    newDisplayCards.push(<InfluencersCard card={card} />);
                    break;
                case 'topRetweets':
                    newDisplayCards.push(<RetweetsCard card={card} />);
                    break;
                case 'words':
                    newDisplayCards.push(<WordsCard card={card} />);
                    break;
                case 'volume':
                    newDisplayCards.push(<VolumeSentimentCard card={card} />);
                    break;
                default:
                    newDisplayCards.push(<LoadingCard key={'loading_'+i }/>);
                    break;
              }
          });
      }
      return newDisplayCards;
    }

    render() {
        const gridProps = {
          width       : this.state.width,
          layouts     : this.state.layouts,
          breakpoints : this.breakpoints,
          cols        : this.cols,
          margin      : [0, 0],
          isRezisable : false,
          isDraggable : false,
          rowHeight   : 1
        };
        return (
          <div className="card-list" ref="mainElemRef">
            <GridLayout className="ei-grid-layout" {...gridProps} >
              {this.prepCards().map( (card, i) =>
                <div key={i} style={{zIndex: NUM_CARDS - i + 1}}>
                  {card}
                </div>
              )}
            </GridLayout>
          </div>
        );
    }
}
