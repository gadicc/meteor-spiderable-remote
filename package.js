Package.describe({
  summary: "Like spiderable, but uses a remote phantomjs binary",
  version: "0.0.9",
  git: "https://github.com/gadicohen/meteor-spiderable-remote.git"
});

Npm.depends({
	'phantomjs-remote': '0.0.9'
});

Package.on_use(function (api) {
  api.versionsFrom("METEOR@0.9.0");
  api.use('webapp', 'server');
	api.use(['templating'], 'client');
	api.use(['underscore'], ['client', 'server']);

	if (api.export)
		api.export('Spiderable', 'server');

	api.add_files('spiderable.html', 'client');
	api.add_files('spiderable-remote.js', 'server');
});
