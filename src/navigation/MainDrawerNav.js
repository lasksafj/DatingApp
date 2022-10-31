/**
 * Created by minhphan on 7/24/2017.
 */
import React from 'react';
import {Dimensions, TouchableOpacity, Image, Text} from 'react-native';
import {DrawerNavigator, StackNavigator} from 'react-navigation';
import DrawerMenu from "../components/DrawerMenu";
import CallHandle from '../screens/authorized/Call/CallHandle';
import EditProfile from '../screens/authorized/Profile/EditProfile';
import BackGroundSetting from '../screens/authorized/Profile/BackgroundSetting'
import AddMemoryAndReminderContainer from '../screens/authorized/Memories/AddMemoryAndReminder/AddMemoryAndReminderContainer'
import icon_menu from '../media/icons/ic_menu.png'
const {width, height} = Dimensions.get('window');
const iconSize = height / 13 * 0.6;


import MainTabNav from './MainTabNav'


export const MainStackNav = StackNavigator({
        TabNav: {
            screen: MainTabNav,

            navigationOptions: ({navigation}) => ({
                title: 'JustDate',
                headerTitleStyle: {
                    color: '#fff',
                    alignSelf: 'center',
                    marginRight: 30
                },
                headerStyle: {
                    backgroundColor: '#7E007E',
                    height: height / 13,
                },
                headerLeft: (
                    <TouchableOpacity
                        style={{marginLeft: 10}}
                        onPress={() => navigation.navigate('DrawerOpen')}
                    >
                        <Image source={icon_menu} style={{
                            width: iconSize,
                            height: iconSize,
                        }}/>
                    </TouchableOpacity>
                ),
            })
        },
        CallHandleScreen: {
            screen: CallHandle
        },
        EditProfileScreen: {
            screen: EditProfile,
        },
        BackGroundSettingView: {
            screen: BackGroundSetting
        },
        AddMemoryAndReminder: {
            screen: AddMemoryAndReminderContainer,
            navigationOptions: ({navigation}) => ({
                title: 'Thêm'
            }),
        },
    },
    {
        headerMode: 'screen'
    });


export const MainDrawerNav = DrawerNavigator({
        MainStackNav: {
            screen: MainStackNav
        },
    },
    {
        drawerWidth: width / 2,
        drawerPosition: 'left',
        contentComponent: props => <DrawerMenu {...props} />
    }
);

