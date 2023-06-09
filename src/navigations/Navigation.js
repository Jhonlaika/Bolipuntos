import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../components/Home/Home';
import Player from '../components/Player/Player';
import { colors } from '../utils/constants';
import Score from '../components/Score/Score';
import Round from '../components/Round/Round';
import InitView from '../components/InitView/InitView';
import About from '../components/About/About';

const Stack = createNativeStackNavigator();

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: Platform.OS === 'ios' ? 'white' : 'transparent'
    },
};

const Navigation = () => {
    return (
        <NavigationContainer
            theme={MyTheme}
        >
            <Stack.Navigator headerMode="none" screenOptions={{ gestureEnabled: false }}>
                <Stack.Screen options={{ headerShown: false }} name="InitView" component={InitView} />
                <Stack.Screen  options={{ title: 'Home',headerShadowVisible: false,headerTitleAlign: 'center', headerTintColor: colors.white, headerTitleStyle: { color: colors.primary }, headerStyle: { backgroundColor: colors.primary } }} name="Home" component={Home} />
                <Stack.Screen options={{ title: 'Jugadores', headerTintColor: colors.white, headerTitleStyle: { color: colors.white }, headerStyle: { backgroundColor: colors.primary } }} name="Player" component={Player} />
                <Stack.Screen options={{ title: 'Puntajes', headerTitleAlign: 'center', headerTintColor: colors.white, headerTitleStyle: { color: colors.white }, headerStyle: { backgroundColor: colors.primary } }} name="Score" component={Score} />
                <Stack.Screen options={{ title: 'Ronda', headerTitleAlign: 'center', headerBackVisible: false, headerTintColor: colors.white, headerTitleStyle: { color: colors.white }, headerStyle: { backgroundColor: colors.primary } }} name="Round" component={Round} />
                <Stack.Screen options={{title: 'Acerca de'}} name="About" component={About} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
export default Navigation;