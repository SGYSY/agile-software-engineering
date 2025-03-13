# 设置脚本参数
$ApiBaseUrl = "http://localhost:8080"
$LogFile = "room-availability-test-results.log"

# 创建或清空日志文件
"测试开始时间: $(Get-Date)" | Out-File -FilePath $LogFile
"------------------------------------" | Out-File -FilePath $LogFile -Append

# 定义辅助函数
function Send-ApiRequest {
    param (
        [string]$Uri,
        [string]$Method = "GET",
        [object]$Body = $null,
        [string]$TestName = "未命名测试"
    )
    
    # 记录请求信息
    "测试: $TestName" | Out-File -FilePath $LogFile -Append
    "请求 URI: $Uri" | Out-File -FilePath $LogFile -Append
    "请求方法: $Method" | Out-File -FilePath $LogFile -Append
    if ($Body) {
        "请求体: $($Body | ConvertTo-Json -Depth 10)" | Out-File -FilePath $LogFile -Append
    }
    
    try {
        # 暂存原始的环境变量以绕过代理
        $originalEnvHttpProxy = $env:HTTP_PROXY
        $originalEnvHttpsProxy = $env:HTTPS_PROXY
        
        # 临时清除环境变量以禁用代理
        $env:HTTP_PROXY = ""
        $env:HTTPS_PROXY = ""
        
        # 准备 curl 命令
        $curlCommand = if ($Method -eq "GET") {
            # URL编码查询参数以处理特殊字符
            "curl.exe -s -X GET '$Uri'"
        } else {
            # 将JSON保存到临时文件
            $tempFile = [System.IO.Path]::GetTempFileName()
            $jsonBody = $Body | ConvertTo-Json -Depth 10
            $jsonBody | Out-File -FilePath $tempFile -Encoding utf8
            
            "curl.exe -s -X $Method -H 'Content-Type: application/json' -d '@$tempFile' '$Uri'"
        }
        
        "执行curl命令: $curlCommand" | Out-File -FilePath $LogFile -Append
        
        # 执行curl命令
        $responseText = Invoke-Expression $curlCommand
        
        # 删除临时文件(如果存在)
        if (($Method -ne "GET") -and (Test-Path $tempFile)) {
            Remove-Item $tempFile
        }
        
        # 记录响应信息
        "响应内容: $responseText" | Out-File -FilePath $LogFile -Append
        
        # 尝试解析JSON响应
        try {
            $jsonResponse = $responseText | ConvertFrom-Json
            return $jsonResponse
        } catch {
            "无法解析JSON响应: $_" | Out-File -FilePath $LogFile -Append
            return $responseText
        }
    }
    catch {
        "请求出错: $_" | Out-File -FilePath $LogFile -Append
        "错误详情: $($_.Exception.Message)" | Out-File -FilePath $LogFile -Append
        return $null
    }
    finally {
        # 恢复环境变量
        $env:HTTP_PROXY = $originalEnvHttpProxy
        $env:HTTPS_PROXY = $originalEnvHttpsProxy
        
        "------------------------------------" | Out-File -FilePath $LogFile -Append
    }
}

# 验证函数 - 验证可用房间列表
function Verify-RoomAvailability {
    param (
        [PSCustomObject[]]$Rooms,
        [int]$ExpectedMinCount,
        [string]$TestName
    )
    
    "验证: ${TestName}" | Out-File -FilePath $LogFile -Append
    
    # 检查是否获取到房间对象
    if (-not $Rooms) {
        "验证失败: 没有收到房间列表" | Out-File -FilePath $LogFile -Append
        return $false
    }
    
    # 验证返回的房间数量
    $roomCount = if ($Rooms -is [array]) { $Rooms.Count } else { 1 }
    "返回房间数量: $roomCount" | Out-File -FilePath $LogFile -Append
    
    $countVerified = $roomCount -ge $ExpectedMinCount
    "房间数量验证: 至少应有 $ExpectedMinCount 个房间 - $(if($countVerified){'通过'}else{'失败'})" | Out-File -FilePath $LogFile -Append
    
    # 验证返回的每个房间是否可用
    $allAvailable = $true
    if ($Rooms -is [array]) {
        foreach ($room in $Rooms) {
            if (-not $room.available) {
                "发现不可用房间 ID: $($room.id), 名称: $($room.name)" | Out-File -FilePath $LogFile -Append
                $allAvailable = $false
                break
            }
        }
    } elseif ($Rooms.available -eq $false) {
        "发现不可用房间 ID: $($Rooms.id), 名称: $($Rooms.name)" | Out-File -FilePath $LogFile -Append
        $allAvailable = $false
    }
    
    "所有返回房间均为可用状态: $(if($allAvailable){'通过'}else{'失败'})" | Out-File -FilePath $LogFile -Append
    
    # 整体验证结果
    $overallResult = $countVerified -and $allAvailable
    "整体验证结果: $(if($overallResult){'通过'}else{'失败'})" | Out-File -FilePath $LogFile -Append
    "------------------------------------" | Out-File -FilePath $LogFile -Append
    
    return $overallResult
}

# ==================== 主测试逻辑 ====================

Write-Host "开始执行房间可用性API测试..."
Write-Host "注意：此脚本使用 curl.exe 来绕过代理问题"

# 生成测试时间参数 - 使用后端期望的格式 yyyy-MM-dd HH:mm:ss
$today = Get-Date
$tomorrow = $today.AddDays(1)
$dayAfterTomorrow = $today.AddDays(2)
$nextWeek = $today.AddDays(7)

# 格式化函数 - 符合后端格式
function Format-DateTime {
    param (
        [DateTime]$DateTime
    )
    return $DateTime.ToString("yyyy-MM-dd HH:mm:ss")
}

# 测试1: 查询明天上午的可用房间
$test1Start = [uri]::EscapeDataString((Format-DateTime -DateTime $tomorrow.Date.AddHours(2)))
$test1End = [uri]::EscapeDataString((Format-DateTime -DateTime $tomorrow.Date.AddHours(4)))
$test1Uri = "$ApiBaseUrl/api/rooms/available-between?start=$test1Start&end=$test1End"

Write-Host "测试1: 查询明天上午的可用房间..."
$test1Response = Send-ApiRequest -Uri $test1Uri -Method "GET" -TestName "明天上午的可用房间"
$test1Result = if ($test1Response) {
    Verify-RoomAvailability -Rooms $test1Response -ExpectedMinCount 1 -TestName "明天上午的可用房间"
} else {
    Write-Host "测试1失败：无响应" -ForegroundColor Red
    $false
}

# 测试2: 查询下周同一时段的可用房间
$test2Start = [uri]::EscapeDataString((Format-DateTime -DateTime $nextWeek.Date.AddHours(9)))
$test2End = [uri]::EscapeDataString((Format-DateTime -DateTime $nextWeek.Date.AddHours(11)))
$test2Uri = "$ApiBaseUrl/api/rooms/available-between?start=$test2Start&end=$test2End"

Write-Host "测试2: 查询下周同一时段的可用房间..."
$test2Response = Send-ApiRequest -Uri $test2Uri -Method "GET" -TestName "下周同一时段的可用房间"
$test2Result = if ($test2Response) {
    Verify-RoomAvailability -Rooms $test2Response -ExpectedMinCount 1 -TestName "下周同一时段的可用房间" 
} else {
    Write-Host "测试2失败：无响应" -ForegroundColor Red
    $false
}

# 测试3: 查询当前时间的可用房间 (边界条件测试)
$test3Start = [uri]::EscapeDataString((Format-DateTime -DateTime $today))
$test3End = [uri]::EscapeDataString((Format-DateTime -DateTime $today.AddHours(2)))
$test3Uri = "$ApiBaseUrl/api/rooms/available-between?start=$test3Start&end=$test3End"

Write-Host "测试3: 查询当前时间的可用房间..."
$test3Response = Send-ApiRequest -Uri $test3Uri -Method "GET" -TestName "当前时间的可用房间"
$test3Result = if ($test3Response) {
    Verify-RoomAvailability -Rooms $test3Response -ExpectedMinCount 0 -TestName "当前时间的可用房间" 
} else {
    Write-Host "测试3失败：无响应" -ForegroundColor Red
    $false
}

# 测试4: 查询无效时间段 (结束时间早于开始时间)
$test4Start = [uri]::EscapeDataString((Format-DateTime -DateTime $tomorrow.Date.AddHours(11)))
$test4End = [uri]::EscapeDataString((Format-DateTime -DateTime $tomorrow.Date.AddHours(9)))
$test4Uri = "$ApiBaseUrl/api/rooms/available-between?start=$test4Start&end=$test4End"

Write-Host "测试4: 查询无效时间段 (结束时间早于开始时间)..."
$test4Response = Send-ApiRequest -Uri $test4Uri -Method "GET" -TestName "无效时间段查询"
# 这里不验证结果，只记录响应，因为后端可能有不同的处理方式

# 输出总结
"测试总结:" | Out-File -FilePath $LogFile -Append
"测试1 (查询明天上午的可用房间): $(if($test1Result){'通过'}else{'失败'})" | Out-File -FilePath $LogFile -Append
"测试2 (查询下周同一时段的可用房间): $(if($test2Result){'通过'}else{'失败'})" | Out-File -FilePath $LogFile -Append
"测试3 (查询当前时间的可用房间): $(if($test3Result){'通过'}else{'失败'})" | Out-File -FilePath $LogFile -Append
"测试结束时间: $(Get-Date)" | Out-File -FilePath $LogFile -Append

# 在控制台输出结果摘要
Write-Host "`n测试完成! 结果摘要:" -ForegroundColor Cyan
Write-Host "测试1 (查询明天上午的可用房间): $(if($test1Result){'通过 ✓'}else{'失败 ❌'})" -ForegroundColor $(if($test1Result){'Green'}else{'Red'})
Write-Host "测试2 (查询下周同一时段的可用房间): $(if($test2Result){'通过 ✓'}else{'失败 ❌'})" -ForegroundColor $(if($test2Result){'Green'}else{'Red'})
Write-Host "测试3 (查询当前时间的可用房间): $(if($test3Result){'通过 ✓'}else{'失败 ❌'})" -ForegroundColor $(if($test3Result){'Green'}else{'Red'})
Write-Host "测试4 (无效时间段查询): 请查看日志了解详情" -ForegroundColor Yellow
Write-Host "`n详细结果已保存到文件: $LogFile" -ForegroundColor Yellow