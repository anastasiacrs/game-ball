/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	const opt1 = {
	    count: 7,
	    range: {
	        x: 20,
	        y: 30
	    },
	    duration: {
	        min: 40,
	        max: 60
	    },
	    thickness: 0.1,
	    strokeColor: '#444',
	    level: .35,
	    curved: true,
	    color_hsl: 180,
	    color: '#F4F6FE'
	};
	
	const opt2 = {
	    count: 7,
	    range: {
	        x: 20,
	        y: 30
	    },
	    duration: {
	        min: 40,
	        max: 60
	    },
	    thickness: 0.1,
	    strokeColor: '#444',
	    level: .45,
	    curved: true,
	    color_hsl: 210,
	    color: '#F9FAFF'
	};
	
	const opt3 = {
	    count: 7,
	    range: {
	        x: 20,
	        y: 30
	    },
	    duration: {
	        min: 40,
	        max: 60
	    },
	    thickness: 0.1,
	    strokeColor: '#444',
	    level: .55,
	    curved: true,
	    color_hsl: 240,
	    color: '#FDFEFF'
	};

/***/ })
/******/ ]);
//# sourceMappingURL=build.js.map