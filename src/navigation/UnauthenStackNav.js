import {StackNavigator} from 'react-navigation';

import EditProfile from '../screens/authorized/Profile/EditProfile';
import SignIn from '../screens/unauthorized/SignIn';
import SignUp from '../screens/unauthorized/SignUp';
import VerifyUser from '../screens/unauthorized/VerifyUser';
import ChangePassword from '../screens/unauthorized/ChangePassword';
import ForgetPassword from '../screens/unauthorized/ForgetPassword';


export default AuthenStackNav = StackNavigator({
        SignUpScreen: {
            screen: SignUp,
        },
        SignInScreen: {
            screen: SignIn,
        },
        VerifyUserScreen: {
            screen: VerifyUser,

        },
        ChangePassWord: {
            screen: ChangePassword,
        },
        ForgetPassword: {
            screen: ForgetPassword
        }
    },
    {
        headerMode: 'screen'
    }
);
