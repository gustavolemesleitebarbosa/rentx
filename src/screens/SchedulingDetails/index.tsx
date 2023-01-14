import React, { useEffect, useState } from 'react';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory'
import { Button } from '../../components/Button'
import {Feather} from '@expo/vector-icons'
import {format} from 'date-fns'
import {getAccessoryIcon} from '../../utils/getAccessoryIcon'

import { 
  Container, 
  Header, 
  CarImages,
  Content,
  Brand,
  Name, 
  Rent,
  Period,
  Price,
  Details, 
  Description,
  Accessories,
  Footer,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPriceTotal
} from './styles';

import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/core';
import { Alert, StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { CarDTO } from '../../dtos/CarDto';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { api } from '../../services/api';

interface Params {
  car: CarDTO;
  dates: string [];
}

interface RentalPeriod{
  start: string;
  end: string;
}

export function SchedulingDetails() {
  const theme = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  const [loading, setLoading] = useState(false)
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod)
  const { car, dates } = route.params as Params

  const rentTotal = Number(dates.length* car.price)
  
  async function handleConfirmRental(){
    setLoading(true)
    const schedulesByCar = await api.get(`/schedules_bycars/${car.id}`)
    const unavailable_dates = [
      ...schedulesByCar.data.unavailable_dates,
      ...dates
    ]

    await api.post('schedules_byuser', {
      user_id: 1,
      car,
      startDate: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
      endDate: format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy'),
    })

    api.put(`/schedules_bycars/${car.id}`,{id:car.id, unavailable_dates})
    .then(response=>{navigation.navigate('Confirmation', {
     nextScreenRoute:'Home',
     title: 'Carro alugado!',
     message: 'Agora você só precisa ir\naté a concessionária da RENTX\n para pegar o seu automóvel'
    })})
    .catch(()=>{
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
      <ImageSlider imagesUrl={car.photos} />
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
        <Accessories>
          {
           car.accessories.map((accessory)=>(
             <Accessory 
             key ={accessory.type}
             name = {accessory.name}
             icon ={getAccessoryIcon(accessory.type)}
             />
           )) 
          }
        </Accessories>
        <RentalPeriod>
        <CalendarIcon>
          <Feather
          name ="calendar"
          size= {RFValue(24)}
          color= {theme.colors.shape}
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
         color ={theme.colors.success} 
         onPress={handleConfirmRental}
         enabled={!loading}
         loading ={loading}
        />
      </Footer>
    </Container>
  );
}