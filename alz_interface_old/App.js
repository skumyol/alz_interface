import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DataProvider } from './components/DataProvider';
import { LandingPage } from "./components/LandingPage"
import ConsentForm  from "./components/ConsentForm"
import {ContactForm}  from "./components/ContactForm"
import InstructionPage  from "./components/InstructionPage"
import {RecordPage}  from "./components/RecordPage"
import {ReportPage}  from "./components/ReportPage"

// Create a stack navigator
const Stack = createStackNavigator();

function App() {
  return (
    <DataProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Introduction">
        <Stack.Screen name="Introduction" component={ConsentForm} />
        <Stack.Screen name="Welcome" component={LandingPage} />
        <Stack.Screen name="Contact" component={ContactForm} />
        <Stack.Screen name="Instructions" component={InstructionPage} />
        <Stack.Screen name="Record" component={RecordPage} />
        <Stack.Screen name="Report" component={ReportPage} />
      </Stack.Navigator>
    </NavigationContainer>
    </DataProvider>
  );
}

export default App;
