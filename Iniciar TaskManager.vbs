Option Explicit

Dim shell, fileSystem, projectDir, electronExe, result
Set fileSystem = CreateObject("Scripting.FileSystemObject")
projectDir = fileSystem.GetParentFolderName(WScript.ScriptFullName)
electronExe = fileSystem.BuildPath(projectDir, "node_modules\electron\dist\electron.exe")

If Not fileSystem.FileExists(electronExe) Then
  MsgBox "No se encontro Electron. Ejecuta npm.cmd install en la carpeta del proyecto.", vbExclamation, "TaskManager"
  WScript.Quit 1
End If

Set shell = CreateObject("WScript.Shell")
shell.CurrentDirectory = projectDir
result = shell.Run("cmd.exe /d /c npm.cmd run desktop:build", 0, True)
If result <> 0 Then
  MsgBox "No se pudo compilar TaskManager. Ejecuta npm.cmd run desktop:build en la carpeta del proyecto para ver el error.", vbExclamation, "TaskManager"
  WScript.Quit result
End If

shell.Run """" & electronExe & """ """ & projectDir & """", 1, False
