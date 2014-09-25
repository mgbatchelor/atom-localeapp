class HelloController

  def before
    "here"
    "test"
  end

  def after
    I18n.t('controllers.admin.test.hello.test')
    I18n.t('controllers.admin.test.hello.me')
  end

end
