import React, { useState, useEffect } from 'react';
import { StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import theme from '../../../styles/theme';
import { useNavigation } from '@react-navigation/native'
import { Button } from '../../components/Button';
import { Container, Header, Title, SubTitle, Footer, Form } from './styles';
import { Input } from '../../components/Input';
import {useAuth} from '../../hooks/auth'
import { PasswordInput } from '../../components/PasswordInput';
import {database} from '../../database' 
import * as Yup from 'yup'

export  function SignIn() {
const  [email, setEmail] = useState('')
const  [password, setPassword] = useState('')
const navigation = useNavigation()
const {signIn} = useAuth();

useEffect(()=>{
 async function loadData(){
  const userCollection = database.get('users')
  const users = await userCollection.query().fetch();
  console.log(users)
}
loadData()
},[])

 async function handleSignIn(){
  try{
   const schema = Yup.object().shape({
    email: Yup.string()
    .required('E-mail obrigatório')
    .email('Digite um email válido')
    ,
    password: Yup.string()
    .required('A senha é obrigatória')
   })
   await schema.validate({email, password})
   signIn({email, password})
  }
  catch(error){
   if(error instanceof Yup.ValidationError){
    Alert.alert('Opa', error.message)
   }else{
    Alert.alert('Erro na autenticação','Ocorreu um erro ao fazer login verifique as credenciais')
   }
  }
}

function handleNewAccount(){
  navigation.navigate('SignUpFirstStep')
 }

  return (
    <KeyboardAvoidingView behavior='position' enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />
          <Header>
            <Title>
              Estamos{'\n'}quase lá
            </Title>
            <SubTitle>
              Faça seu login para começar{'\n'}uma experiência incrível.
            </SubTitle>
          </Header>
          <Form>
            <Input
              iconName='mail'
              placeholder='E-mail'
              keyboardType='email-address'
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={setEmail}
              value= {email}
            />
            <PasswordInput iconName='lock' placeholder='Senha' onChangeText={setPassword} value ={password} />
          </Form>
          <Footer>
            <Button title='Login' enabled={true} loading={false} onPress={handleSignIn} />
            <Button title='Criar conta gratuita' color={theme.colors.background_secondary} light onPress={handleNewAccount} enabled={true} loading={false} />
          </Footer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}