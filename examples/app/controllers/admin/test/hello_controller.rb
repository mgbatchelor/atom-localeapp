class HelloController

  def basic
    "Replace this Awesome value!"
  end

  def class_values
    "name: #{HelloController.name}"
  end

  def hash_values
    person = {
      name: "hello",
      age: 43
    }
    "test #{person[:name]} (#{person['age']})"
  end

end
