Package.describe({
    summary: "Like spiderable, but uses a remote phantomjs binary"
});

Npm.depends({
	'phantomjs-remote': '0.0.8'
});

Package.on_use(function (api) {
	// 0.6.4 and below support until 2014
	try {
	    api.use('webapp', 'server');
	}
	catch (error) {
	    if (error.code != 'ENOENT')
	        throw(error);
	}	

	api.use(['templating'], 'client');
	api.use(['underscore'], ['client', 'server']);

  	if (api.export)
  		api.export('Spiderable', 'server');

	api.add_files('spiderable.html', 'client');
  	api.add_files('spiderable-remote.js', 'server');
});
