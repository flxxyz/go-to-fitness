/* eslint-disable react/jsx-key */
/* eslint-disable taro/no-jsx-in-class-method */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

import Day from '../../components/day'

export default class Index extends Component {
    constructor(props) {
        super(props)

        const t = new Date()
        let thisYear = t.getFullYear()
        let thisMonth = t.getMonth()
        let thisWeek = t.getDay()
        let thisDay = t.getDate()
        let firstTime = new Date(thisYear, thisMonth)
        let firstDay = firstTime.getDay()
        let lastTime = new Date(thisYear, thisMonth + 1, 0)
        let lastDate = lastTime.getDate()
        let lastDay = lastTime.getDay()
        let realDays = lastDate
        let days = realDays + firstDay + (6 - lastDay)

        this.state = {
            weekDayName: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            weekDayNameShort: ['日', '一', '二', '三', '四', '五', '六'],
            monthDayName: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
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
            dayData: [],  //本月所有日子
        }
    }

    config = {
        navigationBarTitleText: '该健身啦'
    }

    //在render之前执行
    componentWillMount() {
        const { days, firstDay, realDays, thisYear, thisMonth } = this.state
        let data = []

        //处理本月日子
        for (var i = 1; i <= days; i++) {
            let day = i;
            let isPlaceholder = false;

            //判断需要的占位符
            if ((i <= firstDay) || (i > (realDays + firstDay))) {
                day = null;
                isPlaceholder = true
            } else {
                day -= firstDay
            }

            data.push({
                year: thisYear,
                month: thisMonth + 1,
                day: day,
                isPlaceholder: isPlaceholder,
            })
        }

        // console.log(this.state)

        this.setState({
            dayData: data,
        })
    }

    changeDate() {
        const { thisWeek, thisDay, thisMonth, thisYear } = this.state
        console.log(thisDay, thisWeek, thisMonth, thisYear)
    }

    render() {
        const { dayData, thisWeek, thisDay, thisMonth, thisYear, monthDayName, weekDayName, weekDayNameShort } = this.state

        return (
            <View className='index'>
                <View className='header' onClick={this.changeDate}>
                    <Text className='day'>
                        {
                            (thisDay < 10) ? `0${thisDay}` : thisDay
                        }
                    </Text>
                    <Text className='month'>{monthDayName[thisMonth]}</Text>
                    <Text className='year'>{thisYear}</Text>
                    <Text className='week'>{weekDayName[thisWeek]}</Text>
                </View>
                <View className='main'>
                    <View className='head'>
                        {
                            weekDayNameShort.map((value, index) => {
                                return (
                                    <View className='item' key={index}>{value}</View>
                                )
                            })
                        }

                    </View>
                    <View className='days'>
                        {
                            dayData.map((data) => {
                                return (
                                    <Day date={data} key />
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        )
    }
}
