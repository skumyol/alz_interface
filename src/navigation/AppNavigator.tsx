import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ConsentForm } from '../screens/ConsentForm';
import { ContactForm } from '../screens/ContactForm';
import { LandingPage } from '../screens/LandingPage';
import { InstructionPage } from '../screens/InstructionPage';
import { RecordPage } from '../screens/RecordPage';
import { ReportPage } from '../screens/ReportPage';
import { colors } from '../theme';

export type RootStackParamList = {
  Introduction: undefined;
  Contact: undefined;
  Welcome: undefined;
  Instructions: undefined;
  Record: undefined;
  Report: { serverResponse?: string | number };
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Introduction"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
          gestureEnabled: false, // Disable swipe back to maintain flow
        }}
      >
        <Stack.Screen 
          name="Introduction" 
          component={ConsentForm}
          options={{
            title: 'Welcome'
          }}
        />
        <Stack.Screen 
          name="Contact" 
          component={ContactForm}
          options={{
            title: 'Contact Information'
          }}
        />
        <Stack.Screen 
          name="Welcome" 
          component={LandingPage}
          options={{
            title: 'Welcome'
          }}
        />
        <Stack.Screen 
          name="Instructions" 
          component={InstructionPage}
          options={{
            title: 'Instructions'
          }}
        />
        <Stack.Screen 
          name="Record" 
          component={RecordPage}
          options={{
            title: 'Recording'
          }}
        />
        <Stack.Screen 
          name="Report" 
          component={ReportPage}
          options={{
            title: 'Results'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
