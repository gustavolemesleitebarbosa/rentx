import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native'
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory'
import { Button } from '../../components/Button'
import { StyleSheet } from 'react-native'
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon'
import { useTheme } from 'styled-components';
import {
  Container,
  Header,
  CarImages,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Details,
  Description,
  Accessories,
  About,
  Footer
} from './styles';
import { CarDTO } from '../../dtos/CarDto';
import { StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';


interface Params {
  car: CarDTO
}

export function CarDetails() {

  const navigation = useNavigation()
  const route = useRoute()
  const { car } = route.params as Params
  const scrollY = useSharedValue(0)
  const theme = useTheme()

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const statusBarHeight = getStatusBarHeight();
  const headerStyleAnimation = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, 200],
        [200, statusBarHeight + 50],
        Extrapolate.CLAMP
      ),
    };
  });

  const sliderCarStyleAnimation = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, 150],
        [1, 0],
        Extrapolate.CLAMP
      )
    }
  })

  function handleConfirmRental() {
    navigation.navigate('Scheduling', { car })
  }

  return (
    <Container>
      <StatusBar
        bar-style='dark-content'
        backgroundColor='transparent'
        translucent
      />

      <Animated.View style={[headerStyleAnimation, styles.header, { backgroundColor: theme.colors.background_secondary }]}>
        <Animated.View style={sliderCarStyleAnimation}>
        <Header>
          <BackButton  />
        </Header>
          <CarImages>
            <ImageSlider imagesUrl={[...car.photos]} />
          </CarImages>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: getStatusBarHeight() + 160
        }}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>
          <Rent>
            <Period>{car.period}</Period>
            <Price>R$ ${car.price}</Price>
          </Rent>
        </Details>
        <Accessories>{
          car.accessories.map(accessory => (
            <Accessory
              key={accessory.type}
              name={accessory.name}
              icon={getAccessoryIcon(accessory.type)}
            />))
        }
        </Accessories>
        <About> {car.about}
        </About>
        <About> {car.about}
        </About>
        <About> {car.about}
        </About>
        <About> {car.about}
        </About>
      </Animated.ScrollView>
      <Footer>
        <Button title='Escolher período do aluguel' onPress={handleConfirmRental} />
      </Footer>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    zIndex: 1,
  },
});