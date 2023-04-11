import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { ImageSlider } from '../../components/ImageSlider';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';

import {
  Accessories, Brand, CalendarIcon, CarImages, Container, Content, DateInfo,
  DateTitle,
  DateValue, Description, Details, Footer, Header, Name, Period,
  Price, Rent, RentalPeriod, RentalPrice, RentalPriceDetails, RentalPriceLabel, RentalPriceQuota,
  RentalPriceTotal
} from './styles';

import { useNetInfo } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/core';
import { useRoute } from '@react-navigation/native';
import { Alert, StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { CarDTO } from '../../dtos/CarDto';
import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';
import { getPlatformDate } from '../../utils/getPlatformDate';

interface Params {
  car: CarDTO;
  dates: string[];
}

interface RentalPeriod {
  start: string;
  end: string;
}

export function SchedulingDetails() {
  const theme = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  const {user} = useAuth()
  const netInfo = useNetInfo()
  const [loading, setLoading] = useState(false)
  const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod)
  const { car, dates } = route.params as Params

  const rentTotal = Number(dates.length * car.price)

  async function handleConfirmRental() {
    setLoading(true)

    await api.post('/rentals', {
      user_id: 1,
      car_id: car.id,
      start_date: new Date(dates[0]),
      end_date: new Date(dates[dates.length - 1]),
      total: rentTotal
    }).then(() => {
        navigation.navigate('Confirmation', {
          nextScreenRoute: 'Home',
          title: 'Carro alugado!',
          message: 'Agora você só precisa ir\naté a concessionária da RENTX\n para pegar o seu automóvel'
        })
      })
      .catch((error) => {
        Alert.alert('Não foi possível realizar o agendamento')
        setLoading(false)
      })

  }

  useEffect(() => {
    setRentalPeriod({
      start: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
      end: format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy'),
    })
  }, [])

  useEffect(() => {
    async function fetchCarUpdated() {
      const response = await api.get(`/cars/${car.id}`)
      setCarUpdated(response.data)
    }
    if (netInfo.isConnected === true) {
      fetchCarUpdated();
    }
  }, [netInfo.isConnected])


  return (
    <Container>
      <Header>
        <StatusBar
          bar-style='dark-content'
          backgroundColor='transparent'
        />
        <BackButton onPress={() => { }} />
      </Header>
      <CarImages>
        <ImageSlider imagesUrl={!!carUpdated.photos ? carUpdated.photos : [{ id: car.thumbnail, photo: car.thumbnail }]} />
      </CarImages>
      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>
          <Rent>
            <Period>{car.period}</Period>
            <Price>{car.price}</Price>
          </Rent>
        </Details>
        {
          carUpdated.accessories &&
          <Accessories>
            {
              carUpdated.accessories.map(accessory => (
                <Accessory
                  key={accessory.type}
                  name={accessory.name}
                  icon={getAccessoryIcon(accessory.type)}
                />))
            }
          </Accessories>
        }
        <RentalPeriod>
          <CalendarIcon>
            <Feather
              name="calendar"
              size={RFValue(24)}
              color={theme.colors.shape}
            />
          </CalendarIcon>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.start}</DateValue>
          </DateInfo>
          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue>{rentalPeriod.end}</DateValue>
          </DateInfo>
        </RentalPeriod>
        <RentalPrice>
          <RentalPriceLabel> TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>{`R$ ${car.price} x ${dates.length}`}</RentalPriceQuota>
            <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>
      <Footer>
        <Button
          title='Alugar agora'
          color={theme.colors.success}
          onPress={handleConfirmRental}
          enabled={!loading}
          loading={loading}
        />
      </Footer>
    </Container>
  );
}