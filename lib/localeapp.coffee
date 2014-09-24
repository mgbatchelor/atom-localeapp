{BufferedProcess} = require 'atom'

module.exports =

  activate: (state) ->
    atom.workspaceView.command "localeapp:create", => @create()
    atom.workspaceView.append(this)

  deactivate: ->
    atom.workspaceView.detach(this)

  serialize: ->
    ""

  create: ->
    editor = atom.workspace.getActivePaneItem()
    # selectedText = editor.getSelectedText()
    editor.mutateSelectedText (selectedText, index) ->
      text = selectedText.getText().trim().replace(/^["']/, "").replace(/["']$/, "")
      filePath = editor.getPath()
      filePath = filePath.split("/app/")[1].replace("_controller", "").replace(".rb", "")
      key = filePath.split("/")[0..-1]
      key.push(text.toLowerCase().replace(/\ /g, "_"))
      key = key.join(".")
      selectedText.deleteSelectedText()
      selectedText.insertText("I18n.t('#{key}')")
      command = 'localeapp'
      args = ['add', key, "en:\"#{text}\""]
      options = cwd: atom.project.getPath()
      stdout = (output) => console.log("OUT:   " + output)
      stderr = (output) => console.log("ERROR: " + output)
      exit = (returnCode) => console.log "Exited with #{returnCode}"

      console.log("KEY  : #{key}")
      console.log("TEXT : #{text}")

      bp = new BufferedProcess({command, options, args, stdout, stderr, exit })
      bp.process.on 'exit', (nodeError) => console.log(nodeError)
    editor.save()
