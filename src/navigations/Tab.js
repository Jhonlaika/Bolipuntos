import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IconAwesome from 'react-native-vector-icons/FontAwesome5';
import Home from '../components/Home/Home';
import History from '../components/History/History';
import { colors } from '../utils/constants';

const Tab = createBottomTabNavigator();

const TabComponent = ({ route }) => {
    return (
        <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'Home') {
                iconName = 'home';
              }else if(route.name === 'History'){
                iconName = 'history';
              } 
              // You can return any component that you like here!
              return <IconAwesome name={iconName} size={size} color={color} />;
            },
            headerShown:false,
            gestureEnabled:false,
            tabBarHideOnKeyboard:true,
            tabBarActiveTintColor: colors.primary,
            tabBarStyle:{borderTopWidth:0,borderTopRightRadius:10,borderTopLeftRadius:10}

          })}
        >
        <Tab.Screen
         name="Home"
         component={Home}
         options={{
           tabBarLabel: 'Home',
         }}
         />
          <Tab.Screen
         name="History"
         component={History}
         options={{
            tabBarLabel: 'Historial',
          }}
         />
       </Tab.Navigator> 
)
}
export  default TabComponent;
