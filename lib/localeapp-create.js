var BufferedProcess = require('atom').BufferedProcess;
var _ = require('underscore-plus');

var LocaleappCreate = (function(){

  function LocaleappCreate(){
  }

  LocaleappCreate.prototype = {

    run : function() {
      var editor = atom.workspace.getActivePaneItem();
      editor.mutateSelectedText(function(selectedText, index) {
        var text = this.stripQuotes(selectedText.getText());
        var key = this.buildKey(editor.getPath(), text);
        this.replaceText(selectedText, "I18n.t('" + key + "')");
        this.runCommand('localeapp', ['add', key, 'en:' + text]);
      }.bind(this));
      editor.save()
    },

    runCommand : function(command, args) {
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

    buildKey : function(filePath, text){
      var keyPath = this.splitFilePath(filePath);
      keyPath.push(this.keyifyText(text));
      return keyPath.join(".");
    },

    keyifyText : function(text) {
      return text.toLowerCase().replace(/\ /g, "_");
    },

    stripQuotes : function(text) {
      return text.trim().replace(/^["']/, "").replace(/["']$/, "");
    },

    splitFilePath : function(filePath) {
      return _.last(filePath.split("/app/")).replace("_controller", "").replace(".rb", "").split("/");
    },

    replaceText : function(selectedText, replaceWith){
      selectedText.deleteSelectedText();
      selectedText.insertText(replaceWith);
    }

  }

  return LocaleappCreate;
})();

module.exports = LocaleappCreate;
