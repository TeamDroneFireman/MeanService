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

  /**
   * save the drone with a numbered name
   * each number is specific for a name and intervention
   */
  Mean.beforeRemote('create', function(ctx, unused, next){
    var model = ctx.args.data;
    var dPattern = new RegExp(/\d+$/);
    var hasNum = dPattern.test(model.name);
    if (!hasNum){
      var rePattern = new RegExp(/(.*?)\s*?(\d+)?$/);
      var str = model.name.replace(rePattern, '$1');
      Mean.count({intervention: model.intervention, name: {like: str} },
        function(err, res){
          model.name = model.name + ' ' + (res+1);
          next();
      });
    } else {
      next();
    }
  });

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
      accepts: {arg: 'id', type: 'string', required: true},
      returns: {type: 'array', root: true}
    }
  );

  Mean.remoteMethod('getAskedMeansByIntervention', {
      http: {path: '/intervention/:id/asked/', verb: 'get'},
      accepts: {arg: 'id', type: 'string', required: true},
      returns: {type: 'array', root: true}
    }
  );

  Mean.getAskedMeansByIntervention = function (id,callback) {
    Mean.find({ where: {and: [{intervention: id}, {currentState: 'ASKED'}]} },
      function(err, means) {
        callback(null, means);
      });
  };

  Mean.afterRemote('create',function (ctx, unused, next) {
    sendPushMessage(ctx.result, 'Mean/Create');
    next();
  });

  Mean.afterRemote('upsert',function (ctx, unused, next) {
    sendPushMessage(ctx.result, 'Mean/Update');
    next();
  });

  Mean.afterRemote('updateAll',function (ctx, unused, next) {
    sendPushMessage(ctx.result, 'Drone/Update');
    next();
  });
  
  Mean.afterRemote('deleteById',function (ctx, unused, next) {
    sendPushMessage(ctx.result, 'Mean/Delete');
    next();
  });

  Mean.afterRemote('prototype.updateAttributes',function (ctx, unused, next) {
    sendPushMessage(ctx.result, 'Mean/Update');
    next();
  });

  function sendPushMessage(mean,topic){
    var pushMessage = {
      idIntervention : mean.intervention,
      idElement : mean.id,
      timestamp : new Date(Date.now()),
      topic : topic
    };
    var pushService = Mean.app.datasources.pushService;
    pushService.create(pushMessage, function(err,data){
      if (err) throw err;
      if (data.error)
        next('> response error: ' + err.error.stack);
    });
  }
};

