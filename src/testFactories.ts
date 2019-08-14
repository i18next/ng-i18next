import { InitOptions } from 'i18next';

export interface ITestScope extends ng.IScope {
	name: string;
}

export class TestFactories {

	public static getOptions(): InitOptions {
		const i18nextOptions: InitOptions = {
			debug: true,
			fallbackLng: 'dev',
			lng: 'de-DE',
			resources: {
				'de': {
				},
				'de-DE': {
					translation: {
						hello: 'Herzlich Willkommen!',
						content: 'Dies ist Inhalt.',
						contentHTML: 'Dies ist <strong>Inhalt</strong>.',
						dynamicDate: 'Aktuelles Datum: {{date}}',
						helloName: 'Herzlich Willkommen, {{name}}!',
						helloNesting: 'Weißt du was? Du bist $t(hello)',
						woman: 'Frau',
						woman_plural: 'Frauen',
						woman_plural_0: 'Keine Frauen',
						friend: 'Freund',
						friend_male: 'Fester Freund',
						friend_female: 'Feste Freundin',
						helloNameHTML: '<h1>Herzlich Willkommen, {{name}}!</h1>',
					},
				},
				'dev': {
					translation: {
						hello: 'Welcome!',
						content: 'This is content.',
						contentHTML: 'This is <strong>content</strong>.',
						dynamicDate: 'Current date: {{date}}',
						helloName: 'Welcome, {{name}}!',
						helloNesting: 'You know what? You\'re $t(hello)',
						woman: 'Woman',
						woman_plural: 'Women',
						woman_plural_0: 'No women',
						friend: 'Friend',
						friend_male: 'Boyfriend',
						friend_female: 'Girlfriend',
						helloNameHTML: '<h1>Welcome, {{name}}!</h1>',
					},
				},
			},
		};

		return i18nextOptions;
	}
}
