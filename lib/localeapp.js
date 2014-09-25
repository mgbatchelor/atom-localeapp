LocaleappCreate = require('./localeapp-create');

module.exports = {

  activate: function() {
    atom.workspaceView.command("localeapp:create", this.create);
  },

  deactivate: function() {
  },

  create: function() {
    new LocaleappCreate().run();
  }

};
