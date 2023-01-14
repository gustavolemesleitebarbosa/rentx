import React from 'react';

import { ActivityIndicator } from 'react-native';
import { Container, Title } from './styles';
import { useTheme } from 'styled-components';
import {RectButtonProps} from 'react-native-gesture-handler'

interface Props extends RectButtonProps {
  title: string,
  color?: string,
  onPress: () => void,
  enabled?: boolean,
  loading?:boolean,
  light?: boolean;
}

export function Button({ title, color, onPress, enabled = true, loading =false, light = false, ...rest }: Props) {
  const theme = useTheme()
  return (
    <Container
      onPress={onPress} {...rest}
      color={color ? color : theme.colors.main}
      enabled={enabled}
      style={{ opacity: (enabled ===false || loading ===true) ? .5 : 1 }}
    >
      {loading?<ActivityIndicator color ={theme.colors.shape}/>:  <Title light={light}>{title}</Title>}
    </Container>
  );
}