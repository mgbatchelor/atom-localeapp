class HelloController

  def before
    "test othT"
    'Me'
  end

  def after
    I18n.t('controllers.admin.test.hello.test')
    I18n.t('controllers.admin.test.hello.me')
  end


end
