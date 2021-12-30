import {useEffect, useRef, useState} from 'react'
// import Geolocation from '@react-native-community/geolocation'
import Geolocation from 'react-native-geolocation-service'

import {Location} from '../interfaces/appInterfaces'

export const useLocation = () => {
  const [hasLocation, setHasLocation] = useState(false)
  const [routeLines, setRouteLines] = useState<Location[]>([])

  const [initialPosition, setInitialPosition] = useState<Location>({
    latitude: 0,
    longitude: 0,
  })

  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  })

  const watchIdRef = useRef<number>()
  const isMounted = useRef(true)

  /* Evitar llamadas al cambio de State cuando el componente esta desmontado  */
  useEffect(() => {
    isMounted.current = true
    return () => {
      console.log('return', {isMounted})
    }
  }, [])

  useEffect(() => {
    getCurrentLocation().then(location => {
      if (!isMounted.current) {
        return
      }
      setInitialPosition(location)
      setUserLocation(location)
      setRouteLines([...routeLines, location])
      setHasLocation(true)
    })
  }, [])

  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        ({coords}) => {
          resolve({
            latitude: coords.latitude,
            longitude: coords.longitude,
          })
        },
        err => reject({err}),
        {
          enableHighAccuracy: true,
        },
      )
    })
  }

  const followUserLocation = () => {
    watchIdRef.current = Geolocation.watchPosition(
      ({coords}) => {
        if (!isMounted.current) {
          return
        }

        const location = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        }
        setUserLocation(location)
        setRouteLines(routes => [...routes, location])
      },
      err => console.log({err}),
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
      },
    )
  }

  const stopFollowUserLocation = () => {
    if (watchIdRef.current) {
      Geolocation.clearWatch(watchIdRef.current)
    }
  }

  return {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    followUserLocation,
    stopFollowUserLocation,
    userLocation,
    routeLines,
  }
}
