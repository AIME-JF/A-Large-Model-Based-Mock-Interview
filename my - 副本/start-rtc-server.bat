@echo off
echo 正在启动RTC AIGC服务器...
echo.

cd "rtc-aigc-demo-main"

echo 检查Node.js是否安装...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo 安装依赖包...
npm install

echo 启动服务器...
npm run server:start

pause 