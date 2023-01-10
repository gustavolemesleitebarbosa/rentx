import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import { format } from 'date-fns'
import ArrowSvg from '../../assets/arrow.svg'
import { Container, Header, Title, RentalPeriod, DateInfo, DateTitle, DateValue, DateValueWrapper, Content, Footer } from './styles';
import { StatusBar } from 'react-native';
import { Button } from '../../components/Button';
import { Calendar, DayProps, generateInterval, MarkedDateProps } from '../../components/Calendar';
import { useNavigation } from '@react-navigation/core';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {View} from 'react-native'
import { CarDTO } from '../../dtos/CarDto';

interface RentalPeriod {
  startFormatted: string;
  endFormatted: string
}

interface Params {
  car: CarDTO
}

export function Scheduling() {

  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps);
  const [markedDates, setMarkedDates] = useState<MarkedDateProps>({} as MarkedDateProps)
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod)

  const theme = useTheme();
  const navigation = useNavigation()
  const route = useRoute()
  const { car } = route.params as Params

  function handleConfirmRental() {
    if (!rentalPeriod.startFormatted || !rentalPeriod.endFormatted) {
      Alert.alert('selecione o intervalo para alugar')
    }
    else {
      navigation.navigate('SchedulingDetails', { car, dates: Object.keys(markedDates) })
    }
  }

  function handleChangeDate(date: DayProps) {
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if (start.timestamp > end.timestamp) {
      start = end;
      end = start;
    }

    setLastSelectedDate(end);
    const interval = generateInterval(start, end);
    setMarkedDates(interval);

    const firstDate = Object.keys(interval)[0];
    const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

    setRentalPeriod({
      startFormatted: format(getPlatformDate(new Date(firstDate)), 'dd/MM/yyyy'),
      endFormatted: format(getPlatformDate(new Date(endDate)), 'dd/MM/yyyy'),
    })
  }

  return (
    <Container>
      <Header>
        <BackButton color={theme.colors.shape} onPress={() => { }} />
        <StatusBar
          bar-style='light-content'
          translucent
          backgroundColor='transparent'
        />
        <Title>
          Escolha uma{'\n'}data de início{'\n'}e fim do aluguel
        </Title>
        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValueWrapper selected={!!rentalPeriod.startFormatted}>
              <DateValue >{rentalPeriod.startFormatted} </DateValue>
            </DateValueWrapper>
          </DateInfo>
          <ArrowSvg />
          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValueWrapper selected={!!rentalPeriod.endFormatted}>
              <DateValue>{rentalPeriod.endFormatted}</DateValue>
            </DateValueWrapper>
          </DateInfo>
        </RentalPeriod>
      </Header>
      <Content>
        <Calendar
          markedDates={markedDates}
          onDayPress={handleChangeDate}
        />
      </Content>
      <Footer>
        <Button title='Confirmar' onPress={handleConfirmRental} enabled ={!!rentalPeriod.startFormatted}/>
      </Footer>

    </Container>
  );
}