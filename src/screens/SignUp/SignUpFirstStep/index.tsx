import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import * as Yup from 'yup';
import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Input } from '../../../components/Input';
import { Container, Form, FormTitle, Header, Steps, SubTitle, Title } from './styles';

import { Button } from '../../../components/Button';
import { useAuth } from '../../../hooks/auth';

export function SignUpFirstStep() {

  const [name, setName] = useState(' ')
  const [email, setEmail] = useState(' ')
  const [driverLicense, setDriverLicense] = useState('')
  
  const navigation = useNavigation();
  const user = useAuth()

  async function handleNextStep() {
    try{
      const schema = Yup.object().shape({
        name: Yup.string()
        .required('Nome é obrigatório'),
        email: Yup.string()
        .email("Email inválido")
        .required('Email é obrigatório'),
        driverLicense: Yup.string()
        .required('CNH é obrigatória')
      })
     const data = {name, email, driverLicense}
     await schema.validate(data)
     navigation.navigate('SignUpSecondStep', {user: data})
    }
    catch(error){
     if(error instanceof Yup.ValidationError){
      return Alert.alert('Opa',error.message)
     } 
    }
  }

  return (
    <KeyboardAvoidingView behavior='position' enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <Container>
      <Header>
        <BackButton/>
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
        <FormTitle>1. Dados</FormTitle>
        <Input
          iconName="user"
          placeholder="Nome"
          onChangeText={setName}
          value={name}
        />
        <Input
          iconName="mail"
          placeholder="E-mail"
          keyboardType='email-address'
          onChangeText={setEmail}
          value={email}
        />
        <Input
          iconName="credit-card"
          placeholder="CNH"
          keyboardType='numeric'
          onChangeText={setDriverLicense}
          value ={driverLicense}
        />
      </Form>
      <Button
        title='proximo'
        onPress={() => {handleNextStep()}}
      />

    </Container>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}