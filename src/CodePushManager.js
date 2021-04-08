import React, { Component }            from 'react';
import codePush                        from 'react-native-code-push';
import styled                          from 'styled-components'
import {
	Text,
	Alert,
	AppState,
	TouchableOpacity
}                                      from 'react-native';

import appUtils                        from './appUtils'
import App                             from './App'

const Button = ({ text, onPress, bgColor = 'lightblue' }) => (
	<TouchableOpacity
		style={{ padding: 5, marginVertical: 5, backgroundColor: bgColor }}
		onPress={onPress}
	>
		<Text>{text}</Text>
	</TouchableOpacity>
)

const CodePushControlPanel = styled.View`
	padding: 10px;
	border-Width: 5px;
	border-color: purple;
`
const AppVersion = styled.Text`
	font-size: 26px;
`

class CodePushManager extends Component {
	constructor() {
		super()
		this.state = {
			appVersion: null,
			appState: null,
			updateAlreadyDownloaded: false,
			resourceInitialized: false,
			incompatibleVersionCodePush: false,
			incompatibleVersionNative: false,
		}
	}

	async componentDidMount() {
		await this.displayAppVersion()
		AppState.addEventListener('change', this.onAppStateChange)
	}

	componentWillUnmount() {
		AppState.removeEventListener('change', this.onAppStateChange)
	}

	componentDidUpdate(_prevProps, prevState) {
		const {
			resourceInitialized,
			incompatibleVersionNative,
			incompatibleVersionCodePush,
		} = this.state

		if (incompatibleVersionNative) {
			// Open an unclosable pop-up
			Alert.alert('update in store, plz')
			return
		}

		if (!prevState.incompatibleVersionCodePush && incompatibleVersionCodePush) {
			this.syncImmediately()
			return
		}

		if (!prevState.resourceInitialized && resourceInitialized) {
			this.syncOnNextSuspend()
		}
	}

	onAppStateChange = async nextAppState => {
		const { appState } = this.state

		if (appState && appState.match(/inactive|background/) && nextAppState === 'active') {
			await this.syncOnNextSuspend()
		}

		this.setState({ appState: nextAppState })
	}

	syncImmediately = async () => {
		if (this.state.updateAlreadyDownloaded) {
			codePush.restartApp()
			return
		}

		this.sync(codePush.InstallMode.IMMEDIATE)
	}

	syncOnNextSuspend = async () => {
		this.sync(codePush.InstallMode.ON_NEXT_RESUME)
	}

	sync = InstallMode => {
		codePush.sync(
			{
				installMode: InstallMode,
				mandatoryInstallMode: InstallMode,
			},
			this.codePushStatusDidChange.bind(this),
			this.codePushDownloadDidProgress.bind(this),
		)
	}

	codePushStatusDidChange(syncStatus) {
		switch (syncStatus) {
			case codePush.SyncStatus.CHECKING_FOR_UPDATE:
				console.log('[Codepush]: Checking for update.')
				break
			case codePush.SyncStatus.DOWNLOADING_PACKAGE:
				console.log('[Codepush]: Downloading package.')
				break
			case codePush.SyncStatus.AWAITING_USER_ACTION:
				console.log('[Codepush]: Awaiting user action.')
				break
			case codePush.SyncStatus.INSTALLING_UPDATE:
				console.log('[Codepush]: Installing update.')
				break
			case codePush.SyncStatus.UP_TO_DATE:
				console.log('[Codepush]: App up to date.')
				break
			case codePush.SyncStatus.UPDATE_IGNORED:
				console.log('[Codepush]: Update cancelled by user.')
				break
			case codePush.SyncStatus.UPDATE_INSTALLED:
				console.log('[Codepush]: Update installed and will be applied on restart.')
				this.setState({ updateAlreadyDownloaded: true })
				break
			case codePush.SyncStatus.UNKNOWN_ERROR:
				console.log('[Codepush]: An unknown error occurred.')
				break
		}
	}

	codePushDownloadDidProgress(progress) {
		console.log(
			progress.receivedBytes + ' of ' + progress.totalBytes + ' received.',
		)
	}

	displayAppVersion = async () => {
		this.setState({ appVersion: await appUtils.getAppVersion('.') })
	}

	componentDidCatch = (error) => {
		this.sync(codePush.InstallMode.IMMEDIATE)

		// Re-throw to upper error boundary
		throw error
	}

	render() {
		return (
			<>
				<CodePushControlPanel>
					<AppVersion>version: {this.state.appVersion}</AppVersion>

					{/* Control sync flow */}
					<Button
						text={'Resource ready, sync on next suspend'}
						onPress={() => this.setState({ resourceInitialized: true })}
					/>
					<Button
						text={'Incompatible code-push version, sync immediately'}
						onPress={() => this.setState({ incompatibleVersionCodePush: true })}
					/>
					<Button
						text={'Incompatible native version, no need to sync'}
						onPress={() =>
							this.setState({ incompatibleVersionNative: true })
						}
					/>

					{/* Make an error */}
					<Button
						text={'Throw an error inside event handlers'}
						bgColor={'pink'}
						onPress={() => {
							throw Error('Error boundaries do not catch errors inside event handlers.')
						}}
					/>
					<Button
						text={'Set an error on rendering'}
						bgColor={'pink'}
						onPress={() => {
							this.setState({ showTypeError: true })
						}}
					/>
					{this.state.showTypeError && 'ddd'.map(i => console.log)}
				</CodePushControlPanel>

				<App />
			</>
		);
	}
}

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL }

export default codePush(codePushOptions)(CodePushManager)
