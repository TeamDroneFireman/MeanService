module.exports = function(Mean) {
  Mean.disableRemoteMethod('deleteById', true);
  Mean.disableRemoteMethod("updateAll", true);
  Mean.disableRemoteMethod('createChangeStream', true);
  Mean.disableRemoteMethod('findOne', true);
  Mean.disableRemoteMethod('exists', true);
};