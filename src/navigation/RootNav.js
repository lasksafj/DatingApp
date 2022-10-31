import {StackNavigator} from 'react-navigation';
import UnauthenStackNav from './UnauthenStackNav';
import SplashScreen from '../screens/SplashScreen';
import {MainDrawerNav} from './MainDrawerNav';
import Main from'../screens/authorized/Main';

export const RootNav = StackNavigator({
        SplashScreen: {
            screen: SplashScreen
        },
        AuthenStackNav: {
            screen: Main
        },
        UnauthenStackNav: {
            screen: UnauthenStackNav
        },
    },
    {
        headerMode: 'none'
    }
);


