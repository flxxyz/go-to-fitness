/* eslint-disable react/jsx-key */
/* eslint-disable taro/no-jsx-in-class-method */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import { createDate, getDateParams, getDays } from '../../lib/tool'

import Days from '../../components/days'
import PickerSelecter from '../../components/picker'

export default class Index extends Component {
    constructor(props) {
        super(props)

        this.state = {
            weekDayName: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            weekDayNameShort: ['日', '一', '二', '三', '四', '五', '六'],
            monthDayName: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            pickerHeight: '100%',
            showLogin: true,
        }
    }

    config = {
        navigationBarTitleText: '该健身啦'
    }

    //在render之前执行
    componentDidMount() {
        console.log('componentDidMount')

        this.isAuthSuccessful()
    }

    initDate(t) {
        const {
            thisYear,
            thisMonth,
            thisWeek,
            thisDay,
            firstTime,
            firstDay,
            lastTime,
            lastDate,
            lastDay,
            realDays,
            days,
        } = getDateParams(t)
        const daysData = getDays(days, lastDay, realDays, thisYear, thisMonth)

        this.setState({
            thisYear: thisYear,  //今年
            thisMonth: thisMonth,  //这个月
            thisWeek: thisWeek,  //今天星期几
            thisDay: thisDay,  //今天
            lastTime: lastTime,  //这个月最后一个日子
            lastDate: lastDate,  //这个月最后一天
            lastDay: lastDay,  //这个月最后一天星期几
            firstTime: firstTime,  //这个月第一个日子
            firstDay: firstDay,  //这个月第一个日子星期几
            realDays: realDays,  //实际的天数
            days: days,  //这个月包括占位符的所有天数
            daysData: daysData,  //本月所有日子
        })
    }

    changeDate = (e) => {
        const t = createDate(e.year, e.month + 1, e.day)
        this.initDate(t)
    }

    openPicker() {
        this.setState({
            pickerHeight: '0%'
        })
    }

    handlerPicker = (opts) => {
        if (opts) {
            console.log(opts)
            const t = createDate(opts.year, opts.month, opts.day)
            this.initDate(t)
        }
        this.setState({
            pickerHeight: '100%'
        })
    }

    isAuthSuccessful() {
        const userInfo = Taro.getStorageSync('userInfo')
        if (userInfo) {
            const t = createDate()
            this.initDate(t)

            this.setState({
                showLogin: false,
            })
        }
    }

    login() {
        return (
            <View className={'login'}>
                <Button className={'user'} openType='getUserInfo' onGetUserInfo={this.getUserInfo}>
                    <OpenData className={'avatar'} type='userAvatarUrl' />
                </Button>
                <View className={'welcome'}>欢迎你! <OpenData type='userNickName' /></View>
                <View className={'welcome-sub'}>点击头像登录</View>
            </View>
        )
    }

    getUserInfo(e) {
        if (e.detail.hasOwnProperty('userInfo')) {
            const userInfo = e.detail.userInfo
            Taro.setStorageSync('userInfo', userInfo)

            Taro.cloud.callFunction({
                name: 'addUser',
                data: userInfo,
            }).then((res) => {
                console.log('cloud function result:', res)
            })

            this.toast({
                title: '授权成功',
                icon: 'success',
            })

            this.isAuthSuccessful()
        } else {
            this.toast({
                title: '授权失败',
            })
        }
    }

    toast(opts) {
        opts.title = opts.title || ''
        opts.icon = opts.icon || 'none'
        opts.callback = opts.callback || function () { }

        Taro.showToast({
            title: opts.title,
            icon: opts.icon,
            duration: 2000,
            complete: opts.callback
        })
    }

    index() {
        const { daysData, thisWeek, thisDay, thisMonth, thisYear, monthDayName, weekDayName, weekDayNameShort, pickerHeight } = this.state

        return (
            <View className={'index'}>
                <View className={'header'} onClick={this.openPicker}>
                    <Text className={'day'}>
                        {
                            (thisDay < 10) ? `0${thisDay}` : thisDay
                        }
                    </Text>
                    <Text className={'month'}>{monthDayName[thisMonth]}</Text>
                    <Text className={'year'}>{thisYear}</Text>
                    <Text className={'week'}>{weekDayName[thisWeek]}</Text>
                </View>
                <View className={'main'}>
                    <View className={'head'}>
                        {
                            weekDayNameShort.map((value, index) => {
                                return (
                                    <View className={'item'} key={index}>{value}</View>
                                )
                            })
                        }
                    </View>
                    <Days data={daysData} />
                </View>
                <View className={'picker'} style={{ top: pickerHeight }}>
                    <PickerSelecter handlerPicker={this.handlerPicker}
                        changeDate={this.changeDate}
                        monthDayName={monthDayName}
                        daysData={daysData}
                        thisYear={thisYear}
                        thisMonth={thisMonth}
                        thisDay={thisDay} />
                </View>
            </View>
        )
    }

    render() {
        return (
            <View>
                {this.state.showLogin ? this.login() : this.index()}
            </View>
        )
    }
}
