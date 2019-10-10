/* eslint-disable react/no-unused-state */
/* eslint-disable react/react-in-jsx-scope */
import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import './index.scss'

export default class Day extends Component {
    constructor(props) {
        super(props)

        const { date } = props
        this.state = {
            date: date,
        }
    }

    componentDidMount() {
        // console.log('componentDidMount=', this.props)
    }

    onBtn() {
        const { date } = this.state
        if (!date.isPlaceholder) {
            console.log('date=', date);
        }
    }

    color() {
        let max = 5;
        let min = 1;
        let rand = parseInt(Math.random() * (max - min + 1) + min, 10)
        return `level-${rand}`;
    }

    render() {
        const { date } = this.state

        return (
            <View className={!date.isPlaceholder ? `day ${this.color()}` : 'day'} onClick={this.onBtn}>
                <Text className={'text'}>
                    {
                        !date.isPlaceholder ? date.day : ''
                    }
                </Text>
            </View>
        )
    }
}

Day.defaultProps = {
    date: {
        year: 2000,
        month: 1,
        day: 1,
        isPlaceholder: false,
    }
}