import React from 'react';
import { TextInputProps } from 'react-native';
import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

const Input: React.FC<InputProps> = ({ name, icon, ...remainingProps }) => {
  return (
    <Container>
      <Icon name={icon} size={20} color="#666460" />
      <TextInput
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        {...remainingProps}
      />
    </Container>
  );
};

export default Input;
