import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList } from 'react-native';
import { useTheme } from 'styled-components';
import { AntDesign } from '@expo/vector-icons'
import { BackButton } from '../../components/BackButton';
import { Car } from '../../components/Car';
import { CarDTO } from '../../dtos/CarDto';
import { api } from '../../services/api';

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

interface CarProps {
  id: string;
  user_id: string;
  car: CarDTO;
  startDate: string,
  endDate: string
}

export function MyCars() {
  const [cars, setCars] = useState<CarProps[]>([] as CarProps[]);
  const [loading, setLoading] = useState(true)
  const theme = useTheme()

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await api.get('/schedules_byuser?user_id=1')
        setCars(response.data)
      }
      catch (error) {
        console.log(error)
      }
      finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [])


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
                    {item.startDate}
                  </CarFooterDate>
                  <AntDesign
                    name="arrowright"
                    size={20}
                    color={theme.colors.title}
                    style={{ marginHorizontal: 10 }}
                  />
                  <CarFooterDate>
                    {item.endDate}
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