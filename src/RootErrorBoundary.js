import React, { Component }            from 'react';
import styled                          from 'styled-components'

import CodePushManager                 from './CodePushManager'

const Container = styled.View`
	flex: 1;
	padding: 20px;
	align-items: center;
	justify-content: center;
`
const Content = styled.View`
	padding: 20px;
	border-width: 5px;
	margin: 20px;
	border-radius: 10px;
`
const Title = styled.Text`
	font-size: 26px;
	margin-bottom: 20px;
`
const Message = styled.Text`
	font-size: 18px;
`

export default class RootErrorBoundary extends Component {
	constructor(props) {
		super(props)
		this.state = { error: null, errorInfo: null }
	}

	componentDidCatch(error, errorInfo) {
		// TODO Log error to my service
		console.log({ error, errorInfo })
	}

	static getDerivedStateFromError(error) {
		return { error }
	}

	render() {
		if (this.state.error) {
			return (
				<Container>
					<Content>
						<Title>Something went wrong.</Title>
						<Message>How about try to restart App!</Message>
					</Content>
				</Container>
			);
		}

		return <CodePushManager />
	}
}
