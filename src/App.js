import React, { Component }            from 'react'
import styled                          from 'styled-components'
import FastImage                       from 'react-native-fast-image'
import {
	SafeAreaView,
	ScrollView,
}                                      from 'react-native'
import {
	Colors,
	Header,
}                                      from 'react-native/Libraries/NewAppScreen'

const YourImage = () => (
	<FastImage
		style={{ width: 200, height: 200 }}
		source={{
			uri: 'https://unsplash.it/400/400?image=1',
			headers: { Authorization: 'someAuthToken' },
			priority: FastImage.priority.normal,
		}}
		resizeMode={FastImage.resizeMode.contain}
	/>
)

const Container = styled.View`
	padding: 20px;
	background-color: ${Colors.white};
	flex: 1;
`

const AppText = styled.Text`
	font-size: 22px;
`

const ToggleImageBtn = styled.TouchableOpacity``
const ToggleImageBtnText = styled.Text`
	font-size: 20px;
	margin: 10px;
`

class App extends Component {
	constructor() {
		super()
		this.state = {
			showImage: false,
		}
	}

	render() {
		return (
			<SafeAreaView>
				<ToggleImageBtn
					onPress={() => {
						this.setState({ showImage: !this.state.showImage })
					}}
				>
					<ToggleImageBtnText>Toogle Image</ToggleImageBtnText>
				</ToggleImageBtn>
				<ScrollView>
					{this.state.showImage && <YourImage />}
					<Header />
					<Container>
						<AppText>
							to change this aaa screen and then come back to see your edits.
							to change this aaa screen and then come back to see your edits.
							to change this aaa screen and then come back to see your edits.
							to change this aaa screen and then come back to see your edits.
							to change this aaa screen and then come back to see your edits.
							to change this aaa screen and then come back to see your edits.
							to change this aaa screen and then come back to see your edits.
							to change this aaa screen and then come back to see your edits.
							to change this aaa screen and then come back to see your edits.
							to change this aaa screen and then come back to see your edits.
							to change this aaa screen and then come back to see your edits.
							to change this aaa screen and then come back to see your edits.
							to change this aaa screen and then come back to see your edits.
							to change this aaa screen and then come back to see your edits.
							to change this aaa screen and then come back to see your edits.
						</AppText>
					</Container>
				</ScrollView>
			</SafeAreaView>
		)
	}
}

export default App

