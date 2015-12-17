var Benchmark = require('benchmark'),
	tape = require('tape'),
	test = require('../index').test,
	WebGL = require('../index').WebGL,
	GEMMFloatCalculator = require("../index").GEMMFloatCalculator;

var suite = new Benchmark.Suite();

var webgl = new WebGL(),
	calculator = new GEMMFloatCalculator(webgl);

function createBenchmark(M, N, K){

	var alpha, A, B, beta, C;

	// default to square matrices, if only one length is provided
	N = N || M;
	K = K || M;
	var name = M + "x" + K + " . " + K + "x" + N;

	var b = new Benchmark(name, function(){
			result = calculator.calculate(M, N, K, alpha, A, B, beta, null);
	})// add listeners
	.on('start', function(event){
		var a = test.randomArray(M, K);
		A = WebGL.fromArray(a);
		B = WebGL.fromArray(a);
	})
	.on('cycle', function(event) {
	})
	.on('complete', function(event) {

		var pm = '\xb1',
			mu = '\xb5'
			size = this.stats.sample.length;

		var info = Benchmark.formatNumber(this.hz.toFixed(this.hz < 100 ? 2 : 0)) + ' ops/sec ' + 
			' ' + pm + this.stats.rme.toFixed(2) + '% ' +
         	' n = ' + size + 
        	' ' + mu + " = " + (this.stats.mean * 1000).toFixed(0) + 'ms';

		console.log("ok " + event.currentTarget.id + " " + this.name);
		console.log("# " + info );

	});

	return b;
}

console.log("TAP version 13");

suite.add(createBenchmark(512));
suite.add(createBenchmark(1024));

suite.on('complete', function(){
	console.log("1.." + suite.length);
	console.log("# tests " + suite.length);
	console.log("# pass  " + suite.length);

	console.log("\n# ok\n");
});

// run async
suite.run({ 'async': true });

