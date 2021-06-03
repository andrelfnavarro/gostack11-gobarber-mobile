import React from 'react';
import { Image, KeyboardAvoidingView, Platform, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';
import logoImg from '../../assets/logo.png';
import Input from '../../components/Input';
import { Button } from '../../components/Button';

export const SignIn: React.FC = () => {
  const navigation = useNavigation();

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Faça seu logon</Title>
            </View>

            <Input name="email" icon="mail" placeholder="E-mail" />
            <Input name="password" icon="lock" placeholder="Senha" />

            <Button
              onPress={() => {
                console.log('Deu');
              }}
            >
              Entrar
            </Button>

            <ForgotPassword>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <>
          <Icon name="log-in" size={20} color="#ff9000" />
          <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
        </>
      </CreateAccountButton>
    </>
  );
};
