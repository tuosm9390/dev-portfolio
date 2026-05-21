$ErrorActionPreference = "Stop"

$exePath = "D:\development\sumpyo-flutter-app\build\windows\x64\runner\Debug\sumpyo_app.exe"
$outputPath = "D:\development\dev-portfolio\public\images\project-sumpyo.png"

if (-not (Test-Path -LiteralPath $exePath)) {
  throw "Sumpyo executable not found: $exePath"
}

Add-Type @"
using System;
using System.Runtime.InteropServices;

public class WindowCaptureNative {
  [DllImport("user32.dll")]
  public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

  [DllImport("user32.dll")]
  public static extern bool PrintWindow(IntPtr hwnd, IntPtr hdcBlt, int nFlags);

  [DllImport("user32.dll")]
  public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

  [DllImport("user32.dll")]
  public static extern bool SetForegroundWindow(IntPtr hWnd);

  public struct RECT {
    public int Left;
    public int Top;
    public int Right;
    public int Bottom;
  }
}
"@

Add-Type -AssemblyName System.Drawing

$process = Start-Process -FilePath $exePath -WorkingDirectory (Split-Path -Parent $exePath) -PassThru

try {
  $handle = [IntPtr]::Zero
  $deadline = (Get-Date).AddSeconds(30)

  while ((Get-Date) -lt $deadline) {
    Start-Sleep -Milliseconds 500
    $process.Refresh()
    if ($process.MainWindowHandle -ne 0) {
      $handle = $process.MainWindowHandle
      break
    }
  }

  if ($handle -eq [IntPtr]::Zero) {
    throw "Timed out waiting for Sumpyo window"
  }

  [WindowCaptureNative]::ShowWindow($handle, 3) | Out-Null
  [WindowCaptureNative]::SetForegroundWindow($handle) | Out-Null
  Start-Sleep -Seconds 3

  $rect = New-Object WindowCaptureNative+RECT
  [WindowCaptureNative]::GetWindowRect($handle, [ref]$rect) | Out-Null

  $width = [Math]::Max(1, $rect.Right - $rect.Left)
  $height = [Math]::Max(1, $rect.Bottom - $rect.Top)

  $bitmap = New-Object System.Drawing.Bitmap($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $hdc = $graphics.GetHdc()

  try {
    $printed = [WindowCaptureNative]::PrintWindow($handle, $hdc, 2)
  } finally {
    $graphics.ReleaseHdc($hdc)
    $graphics.Dispose()
  }

  if (-not $printed) {
    throw "PrintWindow failed"
  }

  $canvas = New-Object System.Drawing.Bitmap(1200, 750)
  $canvasGraphics = [System.Drawing.Graphics]::FromImage($canvas)
  $canvasGraphics.Clear([System.Drawing.Color]::FromArgb(15, 23, 42))

  $scale = [Math]::Min(1060 / $width, 620 / $height)
  $targetWidth = [int]($width * $scale)
  $targetHeight = [int]($height * $scale)
  $targetX = [int]((1200 - $targetWidth) / 2)
  $targetY = [int]((750 - $targetHeight) / 2)

  $canvasGraphics.DrawImage($bitmap, $targetX, $targetY, $targetWidth, $targetHeight)
  $canvasGraphics.Dispose()

  $canvas.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $canvas.Dispose()
  $bitmap.Dispose()

  Write-Output "saved $outputPath"
} finally {
  if (-not $process.HasExited) {
    Stop-Process -Id $process.Id -Force
  }
}
