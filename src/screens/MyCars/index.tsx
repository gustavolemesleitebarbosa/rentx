import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList } from 'react-native';
import { useTheme } from 'styled-components';
import { AntDesign } from '@expo/vector-icons'
import { BackButton } from '../../components/BackButton';
import { Car } from '../../components/Car';
import {format, parseISO} from 'date-fns'
import { Car as ModelCar} from '../../database/models/Car'
import { api } from '../../services/api';
import { Home } from '../Home';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsQuantity,
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate
} from './styles';
import { LoadAnimation } from '../../components/LoadAnimation';

interface DataProps {
  id: string
  car: ModelCar
  start_date: string;
  end_date: string;
}

export function MyCars() {
  const [cars, setCars] = useState<DataProps[]>([] as DataProps[]);
  const [loading, setLoading] = useState(true)
  const screenIsFocus = useIsFocused()

  const theme = useTheme()

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await api.get('/rentals')
        const dataFormatted = response.data.map((data:DataProps) =>{
          return{
            ...data,
            start_date: format(parseISO(data.start_date),'dd/MM/yyyy'),
            end_date: format(parseISO(data.start_date),'dd/MM/yyyy')
          }
        })
        setCars(dataFormatted)
      }
      catch (error) {
       throw new Error(error as string)
      }
      finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [screenIsFocus])


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
        <SubTitle>
          Conforto segurança e praticidade
        </SubTitle>
      </Header>
      {loading ? <LoadAnimation /> : <Content>
        <Appointments>
          <AppointmentsTitle>
            Agendamentos feitos
          </AppointmentsTitle>
          <AppointmentsQuantity>
            {cars.length}
          </AppointmentsQuantity>
        </Appointments>
        <FlatList
          data={cars}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CarWrapper>
              <Car data={item.car} />
              <CarFooter>
                <CarFooterTitle>
                  Período
                </CarFooterTitle>
                <CarFooterPeriod>
                  <CarFooterDate>
                    {item.start_date}
                  </CarFooterDate>
                  <AntDesign
                    name="arrowright"
                    size={20}
                    color={theme.colors.title}
                    style={{ marginHorizontal: 10 }}
                  />
                  <CarFooterDate>
                    {item.end_date}
                  </CarFooterDate>
                </CarFooterPeriod>
              </CarFooter>
            </CarWrapper>
          )}
        />
      </Content>}
    </Container>
  );
}