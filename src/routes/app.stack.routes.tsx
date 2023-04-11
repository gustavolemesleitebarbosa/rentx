import { createStackNavigator } from '@react-navigation/stack';
import React from "react";
import { CarDetails } from '../screens/CarDetails';
import { Confirmation } from '../screens/Confirmation';
import { Home } from '../screens/Home';
import { Scheduling } from '../screens/Scheduling';
import { SchedulingDetails } from '../screens/SchedulingDetails';

const { Navigator, Screen } = createStackNavigator()

export function AppStackRoutes() {

  return (
    <Navigator screenOptions={{ headerShown: false }}  initialRouteName="Splash">
      <Screen
        name="Home"
        component={Home}
        options ={{
          gestureEnabled: false
        }}
      />
      <Screen
        name="CarDetails"
        component={CarDetails}
      />
      <Screen
        name="Scheduling"
        component={Scheduling}
      />
      <Screen
        name="SchedulingDetails"
        component={SchedulingDetails}
      />
      <Screen
        name="Confirmation"
        component={Confirmation}
      />
    </Navigator>
  )
}