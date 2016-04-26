module.exports = function(Mean) {
/*
  Mean.beforeRemote('*', function(ctx, unused, next) {
    Mean.app.datasources.userService
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
*/
  Mean.disableRemoteMethod('deleteById', true);
  Mean.disableRemoteMethod('updateAll', true);
  Mean.disableRemoteMethod('createChangeStream', true);
  Mean.disableRemoteMethod('findOne', true);
  Mean.disableRemoteMethod('exists', true);


  /**
   * return all the SIG used in the intervention passed as parameter
   * @param id
   * @param callback
   */
  Mean.getByIntervention= function(id, callback) {
    Mean.find({ where: {intervention: id} }, function(err, Means) {
      callback(null, Means);
    });
  };

  Mean.remoteMethod(
    'getByIntervention',
    {
      http: {path: '/intervention/:id', verb: 'get'},
      accepts: {arg: 'id', type: 'number', required: true},
      returns: {type: 'array', root: true}
    }
  );
};
