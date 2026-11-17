$lanzador = Join-Path $PSScriptRoot "lanzar.ps1"
$escritorio = [Environment]::GetFolderPath("Desktop")
$ruta = Join-Path $escritorio "TaskManager.lnk"

$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
$shell = New-Object -ComObject WScript.Shell
$acceso = $shell.CreateShortcut($ruta)
$acceso.TargetPath = "powershell.exe"
$acceso.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$lanzador`""
$acceso.WorkingDirectory = Split-Path -Parent $PSScriptRoot
$acceso.Description = "TaskManager"
if (Test-Path $edge) { $acceso.IconLocation = $edge }
$acceso.Save()
Write-Host "Acceso directo creado en $ruta"
