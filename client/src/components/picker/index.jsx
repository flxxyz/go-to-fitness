import Taro, { Component } from "@tarojs/taro";
import { View, Text, PickerView, PickerViewColumn } from "@tarojs/components";
import './index.scss'

export default class PickerSelecter extends Component {
    constructor(props) {
        super(props)

        const date = new Date()
        const years = []
        const months = []
        const days = []
        for (let i = 2000; i <= date.getFullYear(); i++) {
            years.push(i)
        }
        for (let i = 1; i <= 12; i++) {
            months.push(i)
        }
        for (let i = 1; i <= 31; i++) {
            days.push(i)
        }

        const { thisYear, thisMonth, thisDay, monthDayName, daysData } = props

        this.state = {
            years: years,
            months: monthDayName,
            days: days,
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            value: [thisYear, thisMonth, thisDay - 1],
            daysData: daysData,
        }
    }

    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps', nextProps)
        this.setState({
            ...nextProps
        })
    }

    onChange(e) {
        const val = e.detail.value

        this.setState({
            year: this.state.years[val[0]],
            month: this.state.months[val[1]],
            day: this.state.days[val[2]],
            value: val,
            newValue: {
                year: this.state.years[val[0]],
                month: val[1],
                day: this.state.days[val[2]]
            }
        })
    }

    onSuccess() {
        this.props.handlerPicker(this.state.newValue)
        console.log('success')
    }

    onCancel() {
        this.props.handlerPicker(false)
        console.log('cancel')
    }

    render() {
        const { years, months, value, daysData } = this.state

        return (
            <View className='picker-seleter'>
                <View className='picker-mark' onClick={this.onCancel}></View>
                <View className='picker-control'>
                    <Text className='picker-control-button' onClick={this.onCancel}>取消</Text>
                    <Text className='picker-control-button' style="float: right" onClick={this.onSuccess}>确定</Text>
                </View>
                <PickerView className='picker' value={value} onChange={this.onChange}>
                    <PickerViewColumn className="picker-column">
                        {
                            years.map(item => {
                                return (
                                    <View className='picker-column-item' key>{item}年</View>
                                )
                            })
                        }
                    </PickerViewColumn>
                    <PickerViewColumn className="picker-column">
                        {
                            months.map(item => {
                                return (
                                    <View className='picker-column-item' key>{item}</View>
                                )
                            })
                        }
                    </PickerViewColumn>
                    <PickerViewColumn className="picker-column">
                        {
                            daysData.map(item => {
                                if (!item.isPlaceholder) {
                                    return (
                                        <View className='picker-column-item' key>{item.day}日</View>
                                    )
                                }
                            })
                        }
                    </PickerViewColumn>
                </PickerView>
            </View>
        )
    }
}

PickerSelecter.defaultProps = {
    thisMonth: 0,
    thisDay: 0,
    monthDayName: new Array(),
    daysData: new Array(),
}