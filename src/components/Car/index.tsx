import React from 'react';

import { CarImage, Container } from './styles';
import { Details, Brand, Name, About, Rent, Period, Price, Type } from './styles'
import { RectButtonProps } from 'react-native-gesture-handler';
import { Car as ModelCar } from '../../database/models/Car';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { useNetInfo } from '@react-native-community/netinfo';

interface Props extends RectButtonProps {
  data: ModelCar
}

export function Car({ data, ...rest }: Props) {
  const MotorIcon = getAccessoryIcon(data.fuel_type)
  const netInfo = useNetInfo()

  return (
    <Container {...rest} >
      <Details>
        <Brand>
          {data.brand}
        </Brand>
        <Name> {data.name}</Name>
        <About>
          <Rent>
            <Period>{data.period}</Period>
            <Price>{`R$ ${ netInfo.isConnected ===true? data.price:'...'}`}</Price>
          </Rent>
          <Type>
            <MotorIcon />
          </Type>
        </About>
      </Details>
      <CarImage resizeMode='contain' source={{ uri: data.thumbnail }} />
    </Container>
  );
}
