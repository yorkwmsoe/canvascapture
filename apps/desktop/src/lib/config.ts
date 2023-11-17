import { invoke } from '@tauri-apps/api/tauri';

const configState: ConfigState = {
	canvasDomain: 'https://msoe.instructure.com',
	canvasApiToken: undefined
};

export type ConfigState = {
	canvasDomain: string | undefined;
	canvasApiToken: string | undefined;
};

export const getConfigState = () => configState;

export const isConfigSetup = () =>
	configState.canvasApiToken !== undefined && configState.canvasDomain !== undefined;

export async function updateConfigState(config: Partial<ConfigState>) {
	if (config.canvasApiToken) {
		configState.canvasApiToken = config.canvasApiToken;
	}
	if (config.canvasDomain) {
		configState.canvasDomain = config.canvasDomain;
	}
	await invoke('write_config', {
		config: JSON.stringify(configState)
	});
}

export async function loadConfigState() {
	const json: string = await invoke('read_config');
	try {
		const data = JSON.parse(json) as ConfigState;
		configState.canvasApiToken = data.canvasApiToken;
		configState.canvasDomain = data.canvasDomain;
	} catch (e) {
		console.error(e);
	}
}
