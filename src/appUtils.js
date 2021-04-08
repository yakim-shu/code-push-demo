import codePush                        from 'react-native-code-push';

const utils = {
	async getAppVersion(seperator = '.') {
		const [codePushConfig, update] = await Promise.all([
			codePush.getConfiguration(),
			codePush.getUpdateMetadata()
		])

		if (!update) {
			return codePushConfig.appVersion
		}

		const label = update.label.substring(1)
		return `${update.appVersion}${seperator}${label}`
	},
}

export default utils
