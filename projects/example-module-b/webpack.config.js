const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
	name: 'example-module-b',
	exposes: {
		'./Module': './projects/example-module-b/src/app/app.module.ts',
		"./Component": "./projects/example-module-b/src/app/components/nav/nav.component.ts"
	},
	shared: shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }, ['@angular/platform-browser'])
});
