module.exports = {
	entry: "./js/game.js",
	output: {
		filename: "./js/build.js"
	},
	watch: false,
	watchOptions: {
		aggregateTimeout: 100
	},
	//devtool: 'sourcemap'
	devtool: null


};