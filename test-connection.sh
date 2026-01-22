#!/bin/bash

echo "🔍 Testing Frontend-Backend Connection..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local name=$1
    local url=$2
    
    if curl -s --connect-timeout 5 "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name: Running${NC}"
        return 0
    else
        echo -e "${RED}❌ $name: Not running${NC}"
        return 1
    fi
}

# Test Gateway (main backend entry point)
echo "📡 Testing API Gateway:"
gateway_running=0
if test_endpoint "Gateway" "http://localhost:8000/health"; then
    gateway_running=1
fi

echo ""
echo "🔧 Testing Individual Services:"

# Test individual services
services=(
    "user-service:8001"
    "course-service:8002" 
    "content-service:8003"
    "analytics-service:8004"
    "notification-service:8005"
    "payment-service:8006"
    "ai-service:8007"
)

running_services=0
total_services=${#services[@]}

for service in "${services[@]}"; do
    IFS=':' read -r name port <<< "$service"
    if test_endpoint "$name" "http://localhost:$port/health"; then
        ((running_services++))
    fi
done

echo ""
echo "🌐 Testing Frontend Configuration:"

# Check frontend API client configuration
if [ -f "frontend/src/services/api/client.ts" ]; then
    api_url=$(grep -o "baseURL:.*'[^']*'" frontend/src/services/api/client.ts | grep -o "'[^']*'" | tr -d "'")
    if [ -z "$api_url" ]; then
        api_url=$(grep -o 'baseURL:.*"[^"]*"' frontend/src/services/api/client.ts | grep -o '"[^"]*"' | tr -d '"')
    fi
    
    if [ -n "$api_url" ]; then
        echo -e "📋 Frontend API URL: $api_url"
        if [ "$api_url" = "http://localhost:8000" ]; then
            echo -e "${GREEN}✅ Frontend correctly configured to use Gateway${NC}"
        else
            echo -e "${YELLOW}⚠️  Frontend URL doesn't match Gateway URL${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Could not detect API URL in frontend config${NC}"
    fi
else
    echo -e "${RED}❌ Frontend API client not found${NC}"
fi

echo ""
echo "📊 Connection Test Summary:"
if [ $gateway_running -eq 1 ]; then
    echo -e "${GREEN}Gateway: ✅ Running${NC}"
else
    echo -e "${RED}Gateway: ❌ Not Running${NC}"
fi

echo -e "Services: $running_services/$total_services running"

echo ""
if [ $gateway_running -eq 1 ]; then
    echo -e "${GREEN}🎉 Gateway is running! Frontend should be able to connect.${NC}"
    echo "💡 Make sure your frontend is configured to use: http://localhost:8000"
else
    echo -e "${YELLOW}⚠️  Gateway is not running. Start it with:${NC}"
    echo "   cd TajiConnectMain && docker-compose up gateway"
    echo ""
    echo -e "${YELLOW}Or start all services with:${NC}"
    echo "   cd TajiConnectMain && docker-compose up -d"
fi

echo ""
echo "🚀 To start the frontend:"
echo "   cd frontend && npm start"
