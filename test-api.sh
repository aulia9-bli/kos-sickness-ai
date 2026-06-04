#!/bin/bash

# Kos-Sickness API Testing Script

API_URL="http://localhost:5000"
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Kos-Sickness API Testing Script     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}🧪 Test 1: Health Check${NC}"
echo "GET $API_URL/api/health"
curl -s -X GET "$API_URL/api/health" | json_pp
echo -e "\n"

# Test 2: App Info
echo -e "${YELLOW}🧪 Test 2: App Info${NC}"
echo "GET $API_URL/api/app-info"
curl -s -X GET "$API_URL/api/app-info" | json_pp
echo -e "\n"

# Test 3: Analyze Sickness - Valid Request
echo -e "${YELLOW}🧪 Test 3: Analyze Sickness - Valid Request${NC}"
echo "POST $API_URL/api/analyze-sickness"
echo "Body: {\"complaint\": \"Saya mengalami sakit kepala, pusing, dan demam tinggi sejak kemarin\"}"
curl -s -X POST "$API_URL/api/analyze-sickness" \
  -H "Content-Type: application/json" \
  -d '{"complaint": "Saya mengalami sakit kepala, pusing, dan demam tinggi sejak kemarin"}' \
  | json_pp
echo -e "\n"

# Test 4: Analyze Sickness - Empty Complaint
echo -e "${YELLOW}🧪 Test 4: Analyze Sickness - Empty Complaint (Should Fail)${NC}"
echo "POST $API_URL/api/analyze-sickness"
echo "Body: {\"complaint\": \"\"}"
curl -s -X POST "$API_URL/api/analyze-sickness" \
  -H "Content-Type: application/json" \
  -d '{"complaint": ""}' \
  | json_pp
echo -e "\n"

# Test 5: Analyze Sickness - Too Short
echo -e "${YELLOW}🧪 Test 5: Analyze Sickness - Too Short (Should Fail)${NC}"
echo "POST $API_URL/api/analyze-sickness"
echo "Body: {\"complaint\": \"Sakit\"}"
curl -s -X POST "$API_URL/api/analyze-sickness" \
  -H "Content-Type: application/json" \
  -d '{"complaint": "Sakit"}' \
  | json_pp
echo -e "\n"

# Test 6: Different Complaint
echo -e "${YELLOW}🧪 Test 6: Analyze Sickness - Different Complaint${NC}"
echo "POST $API_URL/api/analyze-sickness"
echo "Body: {\"complaint\": \"Batuk terus-menerus dan pilek sangat banyak sejak 3 hari\"}"
curl -s -X POST "$API_URL/api/analyze-sickness" \
  -H "Content-Type: application/json" \
  -d '{"complaint": "Batuk terus-menerus dan pilek sangat banyak sejak 3 hari"}' \
  | json_pp
echo -e "\n"

echo -e "${GREEN}✅ Testing selesai!${NC}\n"
