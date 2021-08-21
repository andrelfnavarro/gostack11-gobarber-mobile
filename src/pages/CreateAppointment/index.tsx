import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Platform, Alert } from 'react-native';
import { format } from 'date-fns';
import {
  Container,
  BackButton,
  Header,
  HeaderTitle,
  UserAvatar,
  ProvidersList,
  ProvidersListContainer,
  ProviderName,
  ProviderAvatar,
  ProviderContainer,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  Content,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';
import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface Availability {
  hour: number;
  available: boolean;
}

export const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { user } = useAuth();
  const { goBack, navigate } = useNavigation();
  const routeParams = route.params as RouteParams;

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);

  const [availability, setAvailability] = useState<Availability[]>([]);

  useEffect(() => {
    api.get('providers').then(response => setProviders(response.data));
  }, []);

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => setAvailability(response.data));
  }, [selectedDate, selectedProvider]);

  const handleDateChanged = (_event: any, date: Date | undefined): void => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
      setSelectedHour(0);
    }
  };

  const { morningAvailability, afternoonAvailability } = useMemo(() => {
    return {
      afternoonAvailability: availability
        .filter(({ hour }) => hour >= 12)
        .map(({ hour, available }) => {
          return {
            hour,
            available,
            hourFormatted: format(new Date().setHours(hour), 'HH:00'),
          };
        }),
      morningAvailability: availability
        .filter(({ hour }) => hour < 12)
        .map(({ hour, available }) => {
          return {
            hour,
            available,
            hourFormatted: format(new Date().setHours(hour), 'HH:00'),
          };
        }),
    };
  }, [availability]);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);
      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (error) {
      Alert.alert(
        'Erro ao agendar',
        'Ocorreu um erro ao tentar criar seu agendamento. Tente novamente.',
      );
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  return (
    <Container>
      <Header>
        <BackButton onPress={() => goBack()}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            data={providers}
            keyExtractor={provider => provider.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => setSelectedProvider(provider.id)}
                selected={selectedProvider === provider.id}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={selectedProvider === provider.id}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton
            onPress={() => setShowDatePicker(state => !state)}
          >
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker && (
            <DateTimePicker
              textColor="#f4ede8"
              mode="date"
              display="spinner"
              value={selectedDate}
              onChange={handleDateChanged}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({ hourFormatted, hour, available }) => (
                <Hour
                  enabled={available}
                  onPress={() => available && setSelectedHour(hour)}
                  available={available}
                  selected={selectedHour === hour}
                  key={hourFormatted}
                >
                  <HourText selected={selectedHour === hour}>
                    {hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(
                ({ hourFormatted, hour, available }) => (
                  <Hour
                    enabled={available}
                    onPress={() => setSelectedHour(hour)}
                    available={available}
                    selected={selectedHour === hour}
                    key={hourFormatted}
                  >
                    <HourText selected={selectedHour === hour}>
                      {hourFormatted}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={() => handleCreateAppointment()}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};
