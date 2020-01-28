/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-curly-brace-presence */
import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { AtActivityIndicator } from 'taro-ui'

export default class TodoList extends Component {
  constructor(props) {
    super(props)

    const { value, userId } = props
    // this.getTodos(userId, value)
    this.userId = userId
    this.value = value
    this.timer = null

    this.state = {
      done: false,
    }
  }
  componentWillMount() { }

  componentWillReceiveProps(nextProps, nextContext) {
    const { value, userId } = nextProps
    console.log('TodoList', 'componentWillReceiveProps()', value)
    // this.getTodos(userId, value)
    this.userId = userId
    this.value = value
  }

  componentWillUpdate() {
    console.log('TodoList', 'componentWillUpdate()')
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  getTodos(userId, value) {
    //查找当天待办任务
    // Taro.cloud.callFunction({
    //   name: 'getTodo',
    //   data: {
    //     userId: userId,
    //     date: value,
    //   },
    // }).then(res => {
    //   console.log('cloud function result:', res)
    // })

    // this.timer = setTimeout(() => {
    //   const todos = Array(Math.floor(Math.random() * (9 - 1 + 1) + 1)).fill(0).map((v, k) => k)

    //   this.setState({
    //     done: true,
    //     todos
    //   })
    // }, (Math.floor(Math.random() * (9 - 1 + 1) + 1)) * 1000)
  }

  render() {
    const { done, todos } = this.state

    return (
      <View class={'todo-list'}>
        {
          !done
            ? <AtActivityIndicator mode='center'></AtActivityIndicator>
            : todos.map(todo => (
              <View>{this.value}-{todo}</View>
            ))
        }
      </View>
    );
  }
}