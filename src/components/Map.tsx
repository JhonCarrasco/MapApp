import React, {useEffect, useRef, useState} from 'react'
import {StyleSheet} from 'react-native'
import MapView, {Marker, Polyline} from 'react-native-maps'
import {useLocation} from '../hooks/useLocation'
import {LoadingScreen} from '../screens/LoadingScreen'
import Fab from './Fab'

interface Props {
  markers?: Marker[]
}

const Map = ({markers}: Props) => {
  const [showPolyline, setShowPolyline] = useState(false)
  const {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    followUserLocation,
    stopFollowUserLocation,
    userLocation,
    routeLines,
  } = useLocation()
  const mapViewRef = useRef<MapView>()
  const followRef = useRef<boolean>(true)

  /* Cancelar seguimiento */
  useEffect(() => {
    followUserLocation()
    return () => {
      stopFollowUserLocation()
    }
  }, [])

  /* Seguimiento */
  useEffect(() => {
    if (!followRef.current) {
      return
    }

    const {latitude, longitude} = userLocation
    mapViewRef.current?.animateCamera({
      center: {
        latitude,
        longitude,
      },
    })
  }, [userLocation])

  /* Centrar posición */
  const centerPosition = async () => {
    const {latitude, longitude} = await getCurrentLocation()
    followRef.current = true

    mapViewRef.current?.animateCamera({
      center: {
        latitude,
        longitude,
      },
    })
  }

  if (!hasLocation) {
    return <LoadingScreen />
  }

  return (
    <>
      <MapView
        ref={el => (mapViewRef.current = el!)}
        style={{flex: 1}}
        showsUserLocation
        initialRegion={{
          latitude: initialPosition.latitude,
          longitude: initialPosition.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onTouchStart={() => (followRef.current = false)}>
        {/* <Marker
          image={require('../assests/custom-marker.png')}
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          title={'Esto es un titulo'}
          description={'Esto es una descripción del marcador'}
        /> */}

        {showPolyline && (
          <Polyline
            coordinates={routeLines}
            strokeColor="#991000"
            strokeWidth={3}
          />
        )}
      </MapView>

      <Fab
        iconName="compass-outline"
        onPress={centerPosition}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}
      />

      <Fab
        iconName="brush-outline"
        onPress={() => setShowPolyline(value => !value)}
        style={{
          position: 'absolute',
          bottom: 80,
          right: 20,
        }}
      />
    </>
  )
}

export default Map

const styles = StyleSheet.create({})
