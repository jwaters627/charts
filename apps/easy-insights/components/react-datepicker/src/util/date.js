function DateUtil( date ) {
  this._date = date;
}

DateUtil.prototype.isBefore = function( other ) {
  return this._date.isBefore( other._date, 'day' );
};

DateUtil.prototype.isAfter = function( other ) {
  return this._date.isAfter( other._date, 'day' );
};

DateUtil.prototype.sameDay = function( other ) {
  return this._date.isSame( other._date, 'day' );
};

DateUtil.prototype.sameMonth = function( other ) {
  return this._date.isSame( other._date, 'month' );
};

DateUtil.prototype.inRange = function( startDate, endDate ) {
  if ( !startDate || !endDate ) return false;
  let before = startDate._date.startOf( 'day' ).subtract( 1, 'seconds' );
  let after = endDate._date.startOf( 'day' ).add( 1, 'seconds' );
  return this._date.isBetween( before, after );
};

DateUtil.prototype.day = function() {
  return this._date.date();
};

DateUtil.prototype.mapDaysInWeek = function( callback, currMonth ) {
  let week = [];
  let firstDay = this._date.clone();

  for ( let i = 0; i < 7; i++ ) {
    let day = new DateUtil( firstDay.clone().add( i, 'days' ) );

    week[ i ] = callback( day, i, this._date, currMonth );
  }

  return week;
};

DateUtil.prototype.mapWeeksInMonth = function(callback) {
  let month = [];
  let monthValue = this._date._d.getMonth();
  let firstDay = this._date.clone().startOf( 'month' ).startOf( 'week' );

  for ( let i = 0; i < 6; i++ ) {
    let weekStart = new DateUtil( firstDay.clone().add( i, 'weeks' ) );

    month[ i ] = callback( weekStart, i, this._date, monthValue);
  }

  return month;
};

DateUtil.prototype.weekInMonth = function( other ) {
  let firstDayInWeek = this._date.clone();
  let lastDayInWeek = this._date.clone().weekday( 7 );

  return firstDayInWeek.isSame( other._date, 'month' ) ||
    lastDayInWeek.isSame( other._date, 'month' );
};

DateUtil.prototype.format = function() {
  return this._date.format.apply( this._date, arguments );
};

DateUtil.prototype.localeFormat = function() {
  let args = Array.prototype.slice.call( arguments );
  let locale = args.shift();
  return this._date.locale( locale ).format.apply( this._date, args );
};

DateUtil.prototype.addMonth = function() {
  return new DateUtil( this._date.clone().add( 1, 'month' ) );
};

DateUtil.prototype.subtractMonth = function() {
  return new DateUtil( this._date.clone().subtract( 1, 'month' ) );
};

DateUtil.prototype.clone = function() {
  return new DateUtil( this._date.clone() );
};

DateUtil.prototype.safeClone = function( alternative ) {
  if ( !!this._date ) return this.clone();

  if ( alternative === undefined ) alternative = null;
  return new DateUtil( alternative );
};

DateUtil.prototype.moment = function() {
  return this._date;
};

module.exports = DateUtil;
