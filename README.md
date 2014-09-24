# localeapp package

### Currently only works for Rails Controllers

Replace a String in a rails controller with I18n.t("_key_").  Where the key will be the path to the controller, including
the controller name, and the string downcased and underscored.

Example:

```
Given a basic rails project
---
app
  controllers
    admin
      test
        hello_controller.rb
```

```ruby
  class HelloController < ApplicaitonController

    def index
      "Hello World"
    end

  end
```
This the create action will replace the selected text, and send a request to localeapp to create the key and english translation that it replaced.
```ruby
  class HelloController < ApplicaitonController

    def index
      I18n.t('controllers.admin.test.hello.hello_world')
    end

  end
```
