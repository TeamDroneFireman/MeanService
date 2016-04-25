module.exports = function(Mean) {
  const USERSERVICE_URL = 'http://projetm2gla.istic.univ-rennes1.fr:12346/';
  Mean.beforeRemote('*', function(ctx, unused, next) {
    Mean.app.datasources.auth
    .checkAuth(ctx.req.headers.userid, ctx.req.headers.token,
        function (err, response) {
      if (err || response.error || response.id !== ctx.req.headers.token) {
        var e = new Error('You must be logged in to access database');
        e.status = 401;
        next(e);
      } else {
        next();
      }
    });
  });
  Mean.disableRemoteMethod('deleteById', true);
  Mean.disableRemoteMethod('updateAll', true);
  Mean.disableRemoteMethod('createChangeStream', true);
  Mean.disableRemoteMethod('findOne', true);
  Mean.disableRemoteMethod('exists', true);
};
