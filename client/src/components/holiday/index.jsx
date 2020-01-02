import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Holiday extends Component {
    constructor(props) {
        super(props)
        this.state = {}

    }
    componentWillReceiveProps(nextProps) { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <View className='holiday'>
                <Text>休</Text>
            </View>
        )
    }

}