var gulp = require('gulp'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	uglify = require('gulp-uglify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer');

var proc = null;

export function bundle(done) {
	return browserify('public/app/main.js')
		.transform(babelify)
		.bundle()
		.on('error', function(err) {
			console.error(err.stack);
			done();
		})
		.pipe(source('bundle.js'))
		//.pipe(buffer())
		//.pipe(uglify())
		.pipe(gulp.dest('public/'))
		.on('end', done);
};

export function serve(done) {
	if (proc) {
		proc.kill('SIGTERM');
	}
	var spawn = require('child_process').spawn;
	proc = spawn('node', ['index.js']);
	proc.stdout.pipe(process.stdout);
	proc.stderr.pipe(process.stderr);
	proc.on('exit', (code) => {
		done((code) ? "Error: Server exit code: " + code : null);
	});
};

export function watch() {
	gulp.watch('public/app/*.js', bundle)
	gulp.watch([
		'index.js',
		'lib/*.js',
		'data/*.js'
	], serve);
};

const build = gulp.parallel(bundle, serve, watch);
export default build;
