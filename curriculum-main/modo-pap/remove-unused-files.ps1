# Script PowerShell para remover arquivos não utilizados
# Execute com: .\remove-unused-files.ps1

Write-Host "🗑️  NewSong - Remoção de Arquivos Não Utilizados" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$filesToRemove = @(
    "src\js\app.js",
    "src\css\styles.css"
)

$removedCount = 0
$errorCount = 0

foreach ($file in $filesToRemove) {
    $fullPath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $fullPath) {
        try {
            Write-Host "⚠️  Removendo: $file" -ForegroundColor Yellow
            Remove-Item $fullPath -Force
            Write-Host "✅ Removido com sucesso!" -ForegroundColor Green
            $removedCount++
        }
        catch {
            Write-Host "❌ Erro ao remover: $file" -ForegroundColor Red
            Write-Host "   $_" -ForegroundColor Red
            $errorCount++
        }
    }
    else {
        Write-Host "⏭️  Arquivo não encontrado (já foi removido?): $file" -ForegroundColor Gray
    }
    Write-Host ""
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ Arquivos removidos: $removedCount" -ForegroundColor Green
if ($errorCount -gt 0) {
    Write-Host "❌ Erros encontrados: $errorCount" -ForegroundColor Red
}
Write-Host ""
Write-Host "🎉 Limpeza concluída!" -ForegroundColor Green
Write-Host ""
