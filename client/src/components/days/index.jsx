import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import './index.scss';

export default class Days extends Component {
    constructor(props) {
        super(props)

        const { data } = props
        this.state = {
            data: data,
        }
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {
        this.setState({
            ...nextProps
        })
    }

    onBtn(date) {
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
        const { data } = this.state

        return (
            <View className='days'>
                {
                    data.map((date) => {
                        return (
                            <View className={!date.isPlaceholder ? `day ${this.color()}` : 'day'} onClick={() => this.onBtn(date)} key>
                                <Text className={'text'}>
                                    {
                                        !date.isPlaceholder ? date.day : ''
                                    }
                                </Text>
                            </View>
                        )
                    })
                }
            </View>
        )
    }
}

Days.defaultProps = {
    data: new Array(),
}