import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from 'styled-components';
import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { api } from '../../../services/api';
import { Container, Form, FormTitle, Header, Steps, SubTitle, Title } from './styles';

import { Button } from '../../../components/Button';
import { PasswordInput } from '../../../components/PasswordInput';


interface Params {
  user: {
    name: string;
    email: string;
    driverLicense: string
  }
}

export function SignUpSecondStep() {
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme()

  const { user } = route.params as Params;

  async function handleRegister() {
    if (!password || !passwordConfirm) {
      return Alert.alert("Informe a senha e a confirmação")
    }

    if (password !== passwordConfirm) {
      return Alert.alert("As senhas não conferem")
    }

    await api.post('/users', {
      name: user.name,
      email: user.email,
      driver_license: user.driverLicense,
      password
    })
      .then(() => {
        navigation.navigate('Confirmation', {
          nextScreenRoute: 'SignIn',
          title: 'Conta criada',
          message: `Agora é só fazer login\ne aproveitar`
        })
      }).catch((error) => {
        Alert.alert('Opa', error.toString());
      });
  }

  function handleBack() {
    navigation.goBack()
  }

  return (
    <KeyboardAvoidingView behavior='position' enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <BackButton onPress={handleBack} />
            <Steps>
              <Bullet active={true} />
              <Bullet />
            </Steps>
          </Header>
          <Title>
            Crie sua{'\n'}conta
          </Title>
          <SubTitle>
            Faça seu cadastro de{'\n'}forma rápida e fácil
          </SubTitle>
          <Form>
            <FormTitle>2. Senha</FormTitle>
            <PasswordInput onChangeText={setPassword} value={password} iconName='lock' placeholder='Senha' />
            <PasswordInput onChangeText={setPasswordConfirm} value={passwordConfirm} iconName='lock' placeholder='Repetir Senha' />
          </Form>
          <Button
            color={theme.colors.success}
            title='Cadastrar'
            onPress={handleRegister}
          />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}