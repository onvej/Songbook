function addTones( first, second )
{
  var result = ( first + second ) % 7
  if ( result < 0 )
    result += 7
  return result
}

function addSemitones( first, second )
{
  var result = ( first + second ) % 12
  if ( result < 0 )
    result += 12
  return result
}

function getBaseToneByName( name, germanStyle )
{
  name = name.toUpperCase()

  var tones = [
    { name : 'A', semitonesNumber : 9  }, 
    { }, 
    { name : 'C', semitonesNumber : 0  },
    { name : 'D', semitonesNumber : 2  },
    { name : 'E', semitonesNumber : 4  },
    { name : 'F', semitonesNumber : 5  },
    { name : 'G', semitonesNumber : 7  } ]

  var difference = name.charCodeAt( 0 ) - 'A'.charCodeAt( 0 )
  var baseTone

  if ( difference <= 6 && difference != 1 )
    baseTone = { name : tones[ difference ].name, tonesNumber : addTones( difference, 5 ), semitonesNumber : tones[ difference ].semitonesNumber }
  else if ( difference == 1 )
    if ( germanStyle == true )
      baseTone = { name : 'B', tonesNumber : 6, semitonesNumber : 10 }
    else
      baseTone = { name : 'B', tonesNumber : 6, semitonesNumber : 11 }
  else if ( difference == 7 )
    if ( germanStyle == true )
      baseTone = { name : 'H', tonesNumber : 6, semitonesNumber : 11 }

  return baseTone
}

function getToneByName( toneName, germanStyle )
{
  var baseTone = getBaseToneByName( toneName[ 0 ], germanStyle )
  var semitonesNumber = baseTone.semitonesNumber
  var tonesNumber = baseTone.tonesNumber

  for ( var i = 1; i < toneName.length; i++ )
  {
    if ( toneName.charAt( i ) == '#' )
      semitonesNumber = addSemitones( semitonesNumber, 1 )
    if ( toneName.charAt( i ) == 'b' )
      semitonesNumber = addSemitones( semitonesNumber, -1 )
  }

  return { name : toneName, tonesNumber : tonesNumber, semitonesNumber : semitonesNumber }
}

function getAccidentals( semitonesNumber )
{
  if ( semitonesNumber < 6 )
    return "#".repeat( semitonesNumber % 12 )
  if ( semitonesNumber > 6)
    return "b".repeat( 12 - semitonesNumber )
  return ""
}

function getBaseToneByNumbers( tonesNumber, semitonesNumber, germanStyle, upperCase )
{
  var tones = [
    { name : 'C', semitonesNumber : 0  },
    { name : 'D', semitonesNumber : 2  },
    { name : 'E', semitonesNumber : 4  },
    { name : 'F', semitonesNumber : 5  },
    { name : 'G', semitonesNumber : 7  },
    { name : 'A', semitonesNumber : 9  } ]

  var baseTone

  if ( tonesNumber == 6 )
    if ( germanStyle == false )
    {
      baseTone = { name : "B", tonesNumber : 6, semitonesNumber : 11 }
    }
    else
      if ( addSemitones( semitonesNumber, -11 ) < 6 )
      {
	baseTone = { name : "H", tonesNumber : 6, semitonesNumber : 11 }
      }
      else
      {
	baseTone = { name : "B", tonesNumber : 6, semitonesNumber : 10 }
      }
  else
    baseTone = { name : tones[ tonesNumber ].name, tonesNumber : tonesNumber, semitonesNumber : tones[ tonesNumber ].semitonesNumber }

  if ( upperCase == false )
    baseTone.name = baseTone.name.toLowerCase()

  return baseTone
}

function getToneByNumbers( tonesNumber, semitonesNumber, germanStyle, upperCase )
{
  baseTone = getBaseToneByNumbers( tonesNumber, semitonesNumber, germanStyle, upperCase )
  name = baseTone.name + getAccidentals( addSemitones( semitonesNumber, - baseTone.semitonesNumber ) )
  
  return { name : name, tonesNumber : tonesNumber, semitonesNumber : semitonesNumber }
}

function transposeTone( tone, tonesNumber, semitonesNumber )
{
  return getToneByNumbers( addTones( tone.tonesNumber, tonesNumber ), addSemitones( tone.semitonesNumber, semitonesNumber ), true, true )
}

function isUpperCase( letter )
{
  return ( letter.toUpperCase() == letter )
}

function transposeToneByName( toneName, tonesNumber, semitonesNumber )
{

  var tone = getToneByName( toneName, true )
  if ( isUpperCase( toneName[ 0 ] ) )
    return getToneByNumbers( addTones( tone.tonesNumber, tonesNumber ), addSemitones( tone.semitonesNumber, semitonesNumber ), true, true ).name
  else
    return getToneByNumbers( addTones( tone.tonesNumber, tonesNumber ), addSemitones( tone.semitonesNumber, semitonesNumber ), true, false ).name
}

function transposeChordByName( string, tonesNumber, semitonesNumber )
{
  var regularExpression, string

  regularExpression = /^[cdefgahbCDEFGAHB][#b]*/g
  string = string.replace( regularExpression, function( string ) { return transposeToneByName( string, tonesNumber, semitonesNumber ) } )
  regularExpression = / [cdefgahbCDEFGAHB][#b]*/g
   string = string.replace( regularExpression, function( string ) { return " " + transposeToneByName( string.substring( 1 ), tonesNumber, semitonesNumber ) } )
  regularExpression = /,[cdefgahbCDEFGAHB][#b]*/g
   string = string.replace( regularExpression, function( string ) { return "," + transposeToneByName( string.substring( 1 ), tonesNumber, semitonesNumber ) } )
  regularExpression = /\/([cdefgahbCDEFGAHB][#b]*)/g
  string = string.replace( regularExpression, function( string ) { return "/" + transposeToneByName( string.substring( 1 ), tonesNumber, semitonesNumber ) } )
  return string
}

var semitonesTransposition, tonesTransposition, germanNotation, clicked, elementList

function transposeSong( tonesNumber, semitonesNumber )
{
  var chords = document.getElementsByTagName( "chord" )
  for( var i = 0; i < chords.length; i++ )
  {
     chords[ i ].innerHTML = transposeChordByName( chords[ i ].innerHTML, tonesNumber, semitonesNumber )
  }

  tonesTransposition = tonesNumber + tonesTransposition
  semitonesTransposition = semitonesNumber + semitonesTransposition
}

var keyList  = [ 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab', 'A', 'B', 'H' ]

function generateTranspositionTable( )
{
  var table = document.createElement( "span" )
  table.setAttribute( "class", "transpositionTable" )

  elementList = [ ]

  for ( var i = 0; i < keyList.length; i++ )
  {
    var key = document.createElement( "span" )
    key.setAttribute( "class", "transpositionKey" )
    key.setAttribute( "onclick", 'clickKey( ' + i + ' );' )
    key.innerHTML = " " + keyList[ i ] + " "
    elementList[ i ] = key
    table.appendChild( key )
  }

  return table
}

function setTransposition()
{
  var regularExpression1 = /^[CDEFGAHBcdefgahb][#b]*/g
  var firstTone = getToneByName( document.getElementsByTagName( "chord" )[ 0 ].innerHTML.match( regularExpression1 )[ 0 ] )
  semitonesTransposition = firstTone.semitonesNumber
  tonesTransposition = firstTone.tonesNumber

  for ( var i = 0; i < keyList.length; i++ )
  {
    if ( firstTone.name.toUpperCase() == keyList[ i ] )
      break
  }

  germanNotation = true

  clicked = i
  elementList[ clicked ].setAttribute( "id" , "selectedKey" )
}

function clickKey( i )
{
  elementList[ clicked ].setAttribute( "id" , "" )
  elementList[ i ].setAttribute( "id" , "selectedKey" )
  clicked = i
  transposeSong( addTones( getToneByName( keyList[ i ], germanNotation ).tonesNumber, -tonesTransposition ), addSemitones( getToneByName( keyList[ i ], germanNotation ).semitonesNumber, -semitonesTransposition ) )
}

function addTranspositionTable( header )
{
  document.body.style.marginTop = '0'

  var table = generateTranspositionTable()
  var box = document.createElement( "span" )
  box.setAttribute( "class", "transpositionTableBox" )
  header.appendChild( box )

  box.appendChild( table )
  box.addEventListener( "mouseout", function() { table.style.display='none'; box.style.borderBottom='1em solid transparent'} );
  box.addEventListener( "mouseover", function() { table.style.display='inline-block'; box.style.borderBottom='none'} );
}
