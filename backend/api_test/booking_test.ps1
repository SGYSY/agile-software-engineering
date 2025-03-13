# 设置脚本参数
$ApiBaseUrl = "http://localhost:8080"
$LogFile = "booking-test-results.log"

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
        # 使用更简单和兼容的代理绕过方法
        
        # 暂存原始的环境变量
        $originalEnvHttpProxy = $env:HTTP_PROXY
        $originalEnvHttpsProxy = $env:HTTPS_PROXY
        
        # 临时清除环境变量以禁用代理
        $env:HTTP_PROXY = ""
        $env:HTTPS_PROXY = ""
        
        # 准备请求参数 - 简化参数设置
        $params = @{
            Uri = $Uri
            Method = $Method
            ContentType = "application/json"
            UseBasicParsing = $true
        }
        
        # 添加请求体(如果有)
        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json -Depth 10
            $params.Add("Body", $jsonBody)
        }
        
        # 直接使用 curl.exe (Windows 10 内置)来绕过代理问题
        if ($Method -eq "GET") {
            $curlCommand = "curl.exe -s -X GET '$Uri'"
        } 
        else {
            # 将JSON保存到临时文件
            $tempFile = [System.IO.Path]::GetTempFileName()
            $jsonBody | Out-File -FilePath $tempFile -Encoding utf8
            
            $curlCommand = "curl.exe -s -X $Method -H 'Content-Type: application/json' -d '@$tempFile' '$Uri'"
            "执行curl命令: $curlCommand" | Out-File -FilePath $LogFile -Append
        }
        
        # 执行curl命令
        $responseText = Invoke-Expression $curlCommand
        
        # 删除临时文件(如果存在)
        if (Test-Path $tempFile) {
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

# 验证函数
function Verify-BookingStatus {
    param (
        [PSCustomObject]$Booking,
        [string]$ExpectedStatus,
        [bool]$ExpectedConflict,
        [string]$TestName
    )
    
    "验证: ${TestName}" | Out-File -FilePath $LogFile -Append
    
    # 检查是否获取到预订对象
    if (-not $Booking) {
        "验证失败: 没有收到预订对象" | Out-File -FilePath $LogFile -Append
        return $false
    }
    
    # 验证状态
    $statusCorrect = $Booking.status -eq $ExpectedStatus
    "状态验证: $($Booking.status) 应该是 $ExpectedStatus - $(if($statusCorrect){'通过'}else{'失败'})" | Out-File -FilePath $LogFile -Append
    
    # 验证冲突标志
    $conflictCorrect = $Booking.conflictDetected -eq $ExpectedConflict
    "冲突验证: $($Booking.conflictDetected) 应该是 $ExpectedConflict - $(if($conflictCorrect){'通过'}else{'失败'})" | Out-File -FilePath $LogFile -Append
    
    # 整体验证结果
    $overallResult = $statusCorrect -and $conflictCorrect
    "整体验证结果: $(if($overallResult){'通过'}else{'失败'})" | Out-File -FilePath $LogFile -Append
    "------------------------------------" | Out-File -FilePath $LogFile -Append
    
    return $overallResult
}

# ==================== 主测试逻辑 ====================

# 直接设置用户和会议室ID，简化脚本
$adminUserId = 1  # 假设ID为1的是管理员
$regularUserId = 3  # 假设ID为2的是普通用户
$roomId = 1

Write-Host "开始执行API测试..."
Write-Host "注意：此脚本使用 curl.exe 来绕过代理问题"

# 生成唯一的时间戳以避免测试之间的冲突
$tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
$dayAfterTomorrow = (Get-Date).AddDays(2).ToString("yyyy-MM-dd")

# 测试1: 普通用户创建预订
$test1Request = @{
    user = @{
        id = $regularUserId
    }
    room = @{
        id = $roomId
    }
    startTime = "$tomorrow`T10:00:00"
    endTime = "$tomorrow`T11:00:00"
    status = "pending"  # 根据 Booking.BookingStatus 枚举值
}

Write-Host "测试1: 普通用户创建预订..."
$test1Response = Send-ApiRequest -Uri "$ApiBaseUrl/api/bookings" -Method "POST" -Body $test1Request -TestName "普通用户创建预订"
$test1Result = if ($test1Response) {
    Verify-BookingStatus -Booking $test1Response -ExpectedStatus "pending" -ExpectedConflict $false -TestName "普通用户创建预订"
} else {
    Write-Host "测试1失败：无响应" -ForegroundColor Red
    $false
}

# 测试2: 管理员用户创建无冲突的预订
$test2Request = @{
    user = @{
        id = $adminUserId
    }
    room = @{
        id = $roomId
    }
    startTime = "$dayAfterTomorrow`T10:00:00"
    endTime = "$dayAfterTomorrow`T11:00:00"
    status = "pending"  # 根据 Booking.BookingStatus 枚举值
}

Write-Host "测试2: 管理员用户创建无冲突预订..."
$test2Response = Send-ApiRequest -Uri "$ApiBaseUrl/api/bookings" -Method "POST" -Body $test2Request -TestName "管理员用户创建无冲突预订"
$test2Result = if ($test2Response) {
    Verify-BookingStatus -Booking $test2Response -ExpectedStatus "confirmed" -ExpectedConflict $false -TestName "管理员用户创建无冲突预订"
} else {
    Write-Host "测试2失败：无响应" -ForegroundColor Red
    $false
}

# 测试3: 创建冲突的预订 (与测试2的时间重叠)
$test3Request = @{
    user = @{
        id = $adminUserId
    }
    room = @{
        id = $roomId
    }
    startTime = "$dayAfterTomorrow`T10:30:00"
    endTime = "$dayAfterTomorrow`T11:30:00"
    status = "pending"  # 根据 Booking.BookingStatus 枚举值
}

Write-Host "测试3: 创建冲突预订..."
$test3Response = Send-ApiRequest -Uri "$ApiBaseUrl/api/bookings" -Method "POST" -Body $test3Request -TestName "创建冲突预订"
$test3Result = if ($test3Response) {
    Verify-BookingStatus -Booking $test3Response -ExpectedStatus "pending" -ExpectedConflict $true -TestName "创建冲突预订"
} else {
    Write-Host "测试3失败：无响应" -ForegroundColor Red
    $false
}

# 输出总结
"测试总结:" | Out-File -FilePath $LogFile -Append
"测试1 (普通用户创建预订): $(if($test1Result){'通过'}else{'失败'})" | Out-File -FilePath $LogFile -Append
"测试2 (管理员用户创建无冲突预订): $(if($test2Result){'通过'}else{'失败'})" | Out-File -FilePath $LogFile -Append
"测试3 (创建冲突预订): $(if($test3Result){'通过'}else{'失败'})" | Out-File -FilePath $LogFile -Append
"测试结束时间: $(Get-Date)" | Out-File -FilePath $LogFile -Append

# 在控制台输出结果摘要
Write-Host "`n测试完成! 结果摘要:" -ForegroundColor Cyan
Write-Host "测试1 (普通用户创建预订): $(if($test1Result){'通过 ✓'}else{'失败 ❌'})" -ForegroundColor $(if($test1Result){'Green'}else{'Red'})
Write-Host "测试2 (管理员用户创建无冲突预订): $(if($test2Result){'通过 ✓'}else{'失败 ❌'})" -ForegroundColor $(if($test2Result){'Green'}else{'Red'})
Write-Host "测试3 (创建冲突预订): $(if($test3Result){'通过 ✓'}else{'失败 ❌'})" -ForegroundColor $(if($test3Result){'Green'}else{'Red'})
Write-Host "`n详细结果已保存到文件: $LogFile" -ForegroundColor Yellow