@echo off
REM Kos-Sickness API Testing Script for Windows

setlocal enabledelayedexpansion

set API_URL=http://localhost:5000

echo.
echo ════════════════════════════════════════
echo    Kos-Sickness API Testing Script
echo ════════════════════════════════════════
echo.

REM Test 1: Health Check
echo Test 1: Health Check
echo GET %API_URL%/api/health
curl -s -X GET "%API_URL%/api/health"
echo.
echo.

REM Test 2: App Info
echo Test 2: App Info
echo GET %API_URL%/api/app-info
curl -s -X GET "%API_URL%/api/app-info"
echo.
echo.

REM Test 3: Analyze Sickness - Valid Request
echo Test 3: Analyze Sickness - Valid Request
echo POST %API_URL%/api/analyze-sickness
echo Body: {"complaint": "Saya mengalami sakit kepala, pusing, dan demam tinggi sejak kemarin"}
curl -s -X POST "%API_URL%/api/analyze-sickness" ^
  -H "Content-Type: application/json" ^
  -d "{\"complaint\": \"Saya mengalami sakit kepala, pusing, dan demam tinggi sejak kemarin\"}"
echo.
echo.

REM Test 4: Analyze Sickness - Empty Complaint
echo Test 4: Analyze Sickness - Empty Complaint (Should Fail)
echo POST %API_URL%/api/analyze-sickness
echo Body: {"complaint": ""}
curl -s -X POST "%API_URL%/api/analyze-sickness" ^
  -H "Content-Type: application/json" ^
  -d "{\"complaint\": \"\"}"
echo.
echo.

REM Test 5: Analyze Sickness - Too Short
echo Test 5: Analyze Sickness - Too Short (Should Fail)
echo POST %API_URL%/api/analyze-sickness
echo Body: {"complaint": "Sakit"}
curl -s -X POST "%API_URL%/api/analyze-sickness" ^
  -H "Content-Type: application/json" ^
  -d "{\"complaint\": \"Sakit\"}"
echo.
echo.

echo Testing selesai!
echo.

endlocal
