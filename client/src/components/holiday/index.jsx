import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Holiday extends Component {
    constructor(props) {
        super(props)
        const no = props.no || false

        this.state = { no }
    }

    componentWillReceiveProps(nextProps) {
        const no = nextProps.no || false

        this.setState({ no })
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        const { no } = this.state
        let text = '休'
        let holidayClass = 'holiday'
        if (no) {
            text = '班'
            holidayClass += ' no'
        }

        return (
            <View className={holidayClass}>
                <Text>{text}</Text>
            </View>
        )
    }

}