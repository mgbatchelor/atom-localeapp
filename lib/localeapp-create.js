var BufferedProcess = require('atom').BufferedProcess;
var _ = require('underscore-plus');

var LocaleappCreate = (function(){

  function LocaleappCreate(){
    this.storedVariables = {};
  }

  LocaleappCreate.prototype = {

    run : function() {
      var editor = atom.workspace.getActivePaneItem();
      editor.mutateSelectedText(function(selectedText, index) {
        this.process(selectedText, editor.getPath());
      }.bind(this));
      editor.save()
    },

    process: function(selectedText, path) {
      var text = this.stripQuotes(selectedText.getText());
      text = this.replaceVariables(text);
      var key = this.buildKey(path, text);
      this.replaceText(selectedText, this.buildI18n(key, this.storedVariables));
      this.runCommand('localeapp', ['add', key, 'en:' + text]);
    },

    runCommand : function(command, args) {
      console.log("run>> " + command + " " + args.join(" "));
      var options = { cwd: atom.project.getPath() };
      var consoleLog = function(output) { console.log(output); };
      bp = new BufferedProcess({
        command: command,
        options: options,
        args: args,
        stdout: consoleLog,
        stderr: consoleLog,
        exit: consoleLog
      });
      bp.process.on('exit', consoleLog);
    },

    buildI18n : function(key, data) {
      if( _.isEmpty(data) ) {
        return "I18n.t('" + key + "')";
      } else {
        hashStr = _.map(_.pairs(data), function(pair) {
          return _.first(pair) + ": " + _.last(pair);
        });
        return "I18n.t('" + key + "', {" + hashStr.join(", ") + "})";
      }
    },

    buildKey : function(filePath, text){
      var keyPath = this.splitFilePath(filePath);
      keyPath.push(this.keyifyText(text));
      return keyPath.join(".");
    },

    keyifyText : function(text) {
      text = text.replace(/[\s-_\.\[]+/g, "_");
      text = text.replace(/[^\w\d]/g, "");
      return text.toLowerCase();
    },

    stripQuotes : function(text) {
      return text.trim().replace(/^["']/, "").replace(/["']$/, "");
    },

    replaceVariables : function(text) {
      var matches = text.match(/#{[^}]*}/g);
      _.each(matches, function(match) {
        var variable = match.substring(2, match.length - 1);
        var key = this.keyifyText(variable);

        text = text.replace(match, "%{" + key + "}");
        this.storeVariable(key, variable);
      }.bind(this));
      return text;
    },

    storeVariable : function(key, variable){
      this.storedVariables[key] = variable;
    },

    splitFilePath : function(filePath) {
      return _.compact(_.last(filePath.split("/app/")).replace("_controller", "").replace(".rb", "").split("/"));
    },

    replaceText : function(selectedText, replaceWith){
      selectedText.deleteSelectedText();
      selectedText.insertText(replaceWith);
    }

  }

  return LocaleappCreate;
})();

module.exports = LocaleappCreate;
