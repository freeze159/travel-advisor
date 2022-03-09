import { CssBaseline, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

import { getPlacesData, getWeatherData } from './api/index'
const App = () => {
  const [places, setPlaces] = useState([])
  const [weather, setWeather] = useState({})

  const [filteredPlaces, setfilteredPlaces] = useState([])
  const [coordinate, setCoordinate] = useState({})
  const [bounds, setBounds] = useState({})
  const [childClicked, setChildClicked] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [type, setType] = useState('restaurants')
  const [rating, setRating] = useState(0)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoordinate({ lat: latitude, lng: longitude })
    })
  }, [])
  useEffect(() => {
    const filterByRating = places.map(place => !place.rating ? place.rating = '0' : place).filter(place => Number(place.rating >= rating))
    setfilteredPlaces(filterByRating);

  }, [rating])

  useEffect(() => {

    setIsLoading(true)
    Promise.all([getWeatherData(coordinate.lat, coordinate.lng),getPlacesData(type, bounds.sw, bounds.ne)]).then(data => {
      setWeather(data[0])
      let filtered = data[1].filter(place => place.name)
      setPlaces(filtered);
      setfilteredPlaces([])
      setIsLoading(false);
    })
    
  }, [type, bounds])
  return (
    <React.Fragment>
      <CssBaseline />
      <Header setCoordinate={setCoordinate} />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces.length ? filteredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            weather={weather}
            setCoordinates={setCoordinate}
            setBounds={setBounds}
            coordinate={coordinate}
            places={filteredPlaces.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default App;
