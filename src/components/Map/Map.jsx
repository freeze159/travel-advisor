import React, { useState } from 'react'
import GoogleMapReact from 'google-map-react'
import { Paper, Typography, useMediaQuery } from '@material-ui/core'
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined'
import Rating from '@material-ui/lab/Rating'
import mapStyles from './mapStyles'
import useStyles from './styles'
const Map = ({ setCoordinates, setBounds, coordinate, places, setChildClicked, weather }) => {
    const classes = useStyles()
    const isDesktop = useMediaQuery('(min-width:600px)')
    const ALT_IMG_URI = 'https://leerit.com/media/blog/uploads/2015/04/08/tu-vung-tieng-anh-ve-nha-hang.jpeg'
    const renderPlace = () => {
        return places?.map(place => (
            <div className={classes.markerContainer}
                lat={Number(place.latitude)}
                lng={Number(place.longitude)}>
                {!isDesktop ?
                    (<LocationOnOutlinedIcon color='primary' fontSize='large' />) :
                    (<Paper elevation={3} className={classes.paper}>
                        <Typography variant='subtitle2' color='textSecondary' >{place.name}</Typography>
                        <img className={classes.pointer}
                            src={place.photo ? place.photo.images.large.url : ALT_IMG_URI}
                            alt={place.name} />
                        <Rating size='small' value={Number(place.rating)} readOnly />
                    </Paper>)
                }
            </div>
        ))

    }
    const renderWeather = () => {
        return weather?.list?.map((data, i) => (
            <div key={i} lat={data.coord.lat} lng={data.coord.lon}>
                <img src={`https://openweathermap.org/img/w/${data.weather[0].icon}.png`} height='100px' />
            </div>))
    }
    return (
        <div className={classes.mapContainer}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
                defaultCenter={coordinate}
                center={coordinate}
                defaultZoom={14}
                margin={[50, 50, 50, 50]}
                options={{disableDefaultUI:true,zoomControl:true,styles:mapStyles}}

                onChange={e => {
                    setCoordinates({ lat: e.center.lat, lng: e.center.lng })
                    setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw })
                }}
                onChildClick={(child) => setChildClicked(child)}
            >
                {renderPlace()}
                {renderWeather()}

            </GoogleMapReact >
        </div >
    )
}

export default Map