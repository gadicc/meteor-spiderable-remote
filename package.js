Package.describe({
    summary: "Like spiderable, but uses a remote phantomjs binary"
});

Npm.depends({
	'phantomjs-remote': '0.0.8'
});

// even though we're serving minified, dynamic loading would be nice
Package.on_use(function (api) {
	api.use(['templating'], 'client');

	api.add_files('spiderable.html', 'client');
  	api.add_files('spiderable-remote.js', 'server');
});
