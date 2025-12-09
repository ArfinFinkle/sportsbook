@echo off
echo 🔍 Checking port 5000...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    set PID=%%a
)

if not defined PID (
    echo ✅ No process is using port 5000.
) else (
    echo ⚠ Found process using port 5000: PID %PID%
    echo 🛑 Killing it...
    taskkill /F /PID %PID%
    echo ✅ Server killed.
)

pause
