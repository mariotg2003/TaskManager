$ErrorActionPreference = "Stop"
$raiz = Split-Path -Parent $PSScriptRoot
$puerto = 4173
$url = "http://localhost:$puerto"
Set-Location $raiz

if (-not (Test-Path "node_modules")) { & npm.cmd install | Out-Null }
if (-not (Test-Path "dist\index.html")) { & npm.cmd run build | Out-Null }

# Arranca el servidor solo si no está ya en marcha
$escuchando = Get-NetTCPConnection -LocalPort $puerto -State Listen -ErrorAction SilentlyContinue
if (-not $escuchando) {
  Start-Process -WindowStyle Hidden -FilePath "npm.cmd" `
    -ArgumentList "run", "preview", "--", "--port", $puerto, "--strictPort" -WorkingDirectory $raiz
  for ($i = 0; $i -lt 30; $i++) {
    if (Get-NetTCPConnection -LocalPort $puerto -State Listen -ErrorAction SilentlyContinue) { break }
    Start-Sleep -Milliseconds 300
  }
}

$navegadores = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
)
$navegador = $navegadores | Where-Object { Test-Path $_ } | Select-Object -First 1
if ($navegador) { Start-Process $navegador "--app=$url" } else { Start-Process $url }
