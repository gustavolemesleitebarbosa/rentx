import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, BackHandler, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { CarList, Container, Header, HeaderContent, TotalCars } from './styles';
import { RFValue } from 'react-native-responsive-fontsize'
import { synchronize } from '@nozbe/watermelondb/sync'
import { database } from '../../database'
import { CarDTO } from '../../dtos/CarDto';
import { Ionicons } from '@expo/vector-icons'
import { useNetInfo } from '@react-native-community/netinfo';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, event, withSpring } from 'react-native-reanimated';

import { RectButton, PanGestureHandler } from 'react-native-gesture-handler';
const ButttonAnimetd = Animated.createAnimatedComponent(RectButton)

import { LoadAnimation } from '../../components/LoadAnimation';
import { api } from '../../services/api'

import Logo from '../../assets/logo.svg'
import { Car } from '../../components/Car';
import {Car as ModelCar} from '../../database/models/Car'
import theme from '../../../styles/theme';

export function Home() {
  const [cars, setCars] = useState<ModelCar[]>([])
  const [loading, setLoading] = useState(true)
  const netInfo = useNetInfo();
  const navigation = useNavigation()

  const positionY = useSharedValue(0);
  const positionX = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart(_, ctx: any) {
      ctx.positionX = positionX.value
      ctx.positionY = positionY.value
    },
    onActive(event, ctx: any) {
      positionX.value = ctx.positionX + event.translationX
      positionY.value = ctx.positionY + event.translationY
    },
    onEnd() {
      positionX.value = withSpring(0)
      positionY.value = withSpring(0)
    },
  })

  const myCarsButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: positionX.value },
        { translateY: positionY.value },
      ]
    }
  });

  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', { car })
  }

  async function offlineSynchronize(){
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        const response = await api
        .get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`);
        
        const { changes, latestVersion } = response.data;
        return { changes, timestamp: latestVersion }
      },
      pushChanges: async ({ changes }) => {
        const user = changes.users;
        await api.post('/users/sync', user).catch(console.log);
      },
    });
  }


  function handleOpenMyCars() {
    navigation.navigate('MyCars')
  }

  useEffect(() => {
    let isMounted = true
    async function fetchCars() {
      try {
        // const response = await api.get('/cars')
        //avoid to set a set a state after the promise is resolved with the component unmounting
        const carCollection = database.get<ModelCar>('cars')
        const cars = await carCollection.query().fetch()
        if (isMounted) {
          setCars(cars)
        }
      }
      catch (error) {
        throw new Error(error as string)
      }
      finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    fetchCars()
    return () => {
      // componet is unmounting end of lifecyle
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if(netInfo.isConnected ===true){
      offlineSynchronize()
    }
  }, [netInfo.isConnected])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true
    })
  }, [])

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header>
        <HeaderContent>
          <Logo width={RFValue(108)}
            height={RFValue(12)} />
          {!loading &&
            <TotalCars>
              {`Total de ${cars.length} carros`}
            </TotalCars>
          }
        </HeaderContent>
      </Header>
      {
        loading ? <LoadAnimation /> :
          <CarList
            data={cars}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => <Car data={item} onPress={() => handleCarDetails(item)} />}
          />
      }
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View
          style={[
            myCarsButtonStyle, {
              position: 'absolute',
              bottom: 13,
              right: 22
            }]}
        >
          <ButttonAnimetd
            onPress={handleOpenMyCars}
            style={[styles.button, { backgroundColor: theme.colors.main }]}
          >
            <Ionicons size={32} name="ios-car-sport" color={theme.colors.shape} />
          </ButttonAnimetd>
        </Animated.View>
      </PanGestureHandler>
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }
})