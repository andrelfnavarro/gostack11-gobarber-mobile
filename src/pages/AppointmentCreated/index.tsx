import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import ptBR from 'date-fns/esm/locale/pt-BR';
import { format } from 'date-fns';
import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from './styles';

interface RouteParams {
  date: number;
}

export const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();
  const { params } = useRoute();

  const routeParams = params as RouteParams;

  const formattedDate = format(
    routeParams.date,
    "EEEE ', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
    { locale: ptBR },
  );

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento concluído</Title>
      <Description>{formattedDate}</Description>

      <OkButton
        onPress={() => {
          reset({
            routes: [{ name: 'Dashboard' }],
            index: 0,
          });
        }}
      >
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  );
};
