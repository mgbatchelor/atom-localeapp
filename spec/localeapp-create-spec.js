var LocaleappCreate = require('../lib/localeapp-create');

describe('Localeapp Create', function() {

  var localeapp = new LocaleappCreate();

  describe("process", function() {

    it("happy path", function() {
      var selectedText = {
        getText: function() { return "value"; }
      };
      spyOn(localeapp, 'stripQuotes').andCallThrough();
      spyOn(localeapp, 'replaceVariables').andCallThrough();
      spyOn(localeapp, 'buildKey').andCallThrough();
      spyOn(localeapp, 'replaceText');
      spyOn(localeapp, 'runCommand');

      localeapp.process(selectedText, "/home/path/app/controllers/hello_controller.rb");
      expect(localeapp.replaceText).toHaveBeenCalledWith(selectedText, "I18n.t('controllers.hello.value')");
      expect(localeapp.runCommand).toHaveBeenCalledWith('localeapp', ['add', 'controllers.hello.value', 'en:value'])
    });

  });

  describe("buildI18n", function() {

    it("wraps the key with I18n.t method", function() {
      expect(localeapp.buildI18n("key.here")).toEqual("I18n.t('key.here')");
    });

    it("wraps the key with I18n.t and addes hash variables", function() {
      expect(localeapp.buildI18n("key.here", { k1: "v1", k2: "v2"})).toEqual("I18n.t('key.here', {k1: v1, k2: v2})");
    });

  });

  describe('buildKey', function() {

    it("uses the path after the app directory", function() {
      var path = "/test/app/controllers/admin/hello_controller.rb";
      var text = "test";
      expect(localeapp.buildKey(path, text)).toEqual("controllers.admin.hello.test");
    });

  });

  describe('keyifyText', function() {

    it("downcases the text", function() {
      expect(localeapp.keyifyText("TEST")).toEqual("test");
    });

    it("replaces all spaces, tabs, and underscores with a single underscore", function() {
      expect(localeapp.keyifyText("te[st  -o  ram.a")).toEqual("te_st_o_ram_a");
    });

    it("removes all characters except words and numbers", function() {
      expect(localeapp.keyifyText("aÎbc1!@#23$5>")).toEqual("abc1235");
    });

  });

  describe("replaceVariables", function() {

    it("replaces erb rails variables with localeapp replace variables", function() {
      expect(localeapp.replaceVariables("Hello, #{person.name}!")).toEqual("Hello, %{person_name}!");
      expect(localeapp.storedVariables).toEqual({person_name: "person.name"});
    });

  });

  describe("stripQuotes", function() {

    it("removes leading and ending quotes", function() {
      expect(localeapp.stripQuotes('"test"')).toEqual("test");
      expect(localeapp.stripQuotes("'test'")).toEqual("test");
      expect(localeapp.stripQuotes("'te\'\"st'")).toEqual("te\'\"st");
    });

  });

  describe("splitFilePath", function() {

    it("uses whole path if no app directory present", function() {
      var path = "/test/controllers/admin/hello_controller.rb";
      expect(localeapp.splitFilePath(path)).toEqual(['test', 'controllers', 'admin', 'hello']);
    });

    it("uses path after 'app' directory", function() {
      var path = "/test/app/controllers/admin/hello_controller.rb";
      expect(localeapp.splitFilePath(path)).toEqual(['controllers', 'admin', 'hello']);
    });

    it("handles files that don't end with _controller", function() {
      var path = "/test/app/views/admin/hello/index.rb";
      expect(localeapp.splitFilePath(path)).toEqual(['views', 'admin', 'hello', 'index']);
    });

  });

});
