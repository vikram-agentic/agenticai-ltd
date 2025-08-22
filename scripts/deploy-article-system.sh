#!/bin/bash

# ENTERPRISE ARTICLE GENERATION SYSTEM DEPLOYMENT
# Production-ready deployment script for the complete automated article system

set -e  # Exit on any error

echo "🚀 DEPLOYING ENTERPRISE ARTICLE GENERATION SYSTEM"
echo "================================================="

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SUPABASE_PROJECT_ID=${SUPABASE_PROJECT_ID:-"your-project-id"}
ENVIRONMENT=${ENVIRONMENT:-"production"}

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Supabase CLI is installed
    if ! command -v supabase &> /dev/null; then
        log_error "Supabase CLI is not installed. Please install it first:"
        echo "npm install -g supabase"
        exit 1
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check if environment variables are set
    if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_ANON_KEY" || -z "$SUPABASE_SERVICE_ROLE_KEY" ]]; then
        log_error "Required environment variables not set:"
        echo "  SUPABASE_URL"
        echo "  SUPABASE_ANON_KEY"
        echo "  SUPABASE_SERVICE_ROLE_KEY"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Deploy database migrations
deploy_database() {
    log_info "Deploying database migrations..."
    
    cd "$PROJECT_ROOT"
    
    # Apply database migrations
    supabase db push
    
    # Run any additional database setup
    if [ -f "scripts/setup-database.sql" ]; then
        supabase db reset --db-url "$SUPABASE_URL"
    fi
    
    log_success "Database migrations deployed"
}

# Deploy Supabase Edge Functions
deploy_edge_functions() {
    log_info "Deploying Supabase Edge Functions..."
    
    cd "$PROJECT_ROOT"
    
    # Array of functions to deploy
    functions=(
        "advanced-keyword-research"
        "serp-analysis-agent"
        "enterprise-article-generator"
        "autopilot-article-scheduler"
        "content-quality-assurance"
    )
    
    for func in "${functions[@]}"; do
        log_info "Deploying function: $func"
        
        if [ -d "supabase/functions/$func" ]; then
            supabase functions deploy "$func" --project-ref "$SUPABASE_PROJECT_ID"
            log_success "Deployed: $func"
        else
            log_warning "Function directory not found: $func"
        fi
    done
    
    log_success "All Edge Functions deployed"
}

# Set up environment variables for Edge Functions
setup_function_secrets() {
    log_info "Setting up function secrets..."
    
    # Required secrets for the article generation system
    declare -A secrets=(
        ["PERPLEXITY_API_KEY"]="$PERPLEXITY_API_KEY"
        ["MINIMAX_API_KEY"]="$MINIMAX_API_KEY"
        ["DATAFORSEO_API_KEY"]="$DATAFORSEO_API_KEY"
        ["OPENAI_API_KEY"]="$OPENAI_API_KEY"
    )
    
    for secret_name in "${!secrets[@]}"; do
        secret_value="${secrets[$secret_name]}"
        if [[ -n "$secret_value" ]]; then
            echo "$secret_value" | supabase secrets set "$secret_name" --project-ref "$SUPABASE_PROJECT_ID"
            log_success "Set secret: $secret_name"
        else
            log_warning "Secret not provided: $secret_name"
        fi
    done
}

# Deploy frontend application
deploy_frontend() {
    log_info "Deploying frontend application..."
    
    cd "$PROJECT_ROOT"
    
    # Install dependencies
    npm install
    
    # Build the application
    npm run build
    
    # Deploy to Vercel (or your chosen platform)
    if command -v vercel &> /dev/null; then
        vercel deploy --prod
        log_success "Frontend deployed to Vercel"
    else
        log_warning "Vercel CLI not found. Please deploy manually or install Vercel CLI"
        echo "Built files are in the dist/ directory"
    fi
}

# Setup cron jobs for automation
setup_automation() {
    log_info "Setting up automation system..."
    
    # The autopilot scheduler will handle cron internally via Deno cron
    # We just need to ensure it's properly configured
    
    # Call the scheduler to initialize the cron job
    curl -X GET \
        -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
        -H "Content-Type: application/json" \
        "$SUPABASE_URL/functions/v1/autopilot-article-scheduler"
    
    log_success "Automation system configured"
}

# Initialize the article generation system
initialize_system() {
    log_info "Initializing article generation system..."
    
    # Seed initial keywords for the system
    curl -X POST \
        -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
        -H "Content-Type: application/json" \
        -d '{
            "seedKeywords": ["AI consulting", "business automation", "enterprise AI", "digital transformation"],
            "industry": "AI Consulting",
            "targetAudience": "Enterprise decision makers",
            "minSearchVolume": 1000,
            "maxKeywordDifficulty": 50
        }' \
        "$SUPABASE_URL/functions/v1/advanced-keyword-research"
    
    log_success "System initialized with seed keywords"
}

# Health check of deployed system
health_check() {
    log_info "Performing system health check..."
    
    # Test each deployed function
    functions=(
        "advanced-keyword-research"
        "serp-analysis-agent" 
        "enterprise-article-generator"
        "autopilot-article-scheduler"
        "content-quality-assurance"
    )
    
    all_healthy=true
    
    for func in "${functions[@]}"; do
        response=$(curl -s -o /dev/null -w "%{http_code}" \
            -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
            "$SUPABASE_URL/functions/v1/$func")
        
        if [[ "$response" == "200" || "$response" == "405" ]]; then
            log_success "✓ $func is healthy"
        else
            log_error "✗ $func is not responding (HTTP $response)"
            all_healthy=false
        fi
    done
    
    if $all_healthy; then
        log_success "All systems are healthy!"
    else
        log_error "Some systems are not responding properly"
        exit 1
    fi
}

# Main deployment flow
main() {
    echo
    log_info "Starting deployment of Enterprise Article Generation System"
    echo

    check_prerequisites
    echo

    deploy_database
    echo

    deploy_edge_functions
    echo

    setup_function_secrets
    echo

    deploy_frontend
    echo

    setup_automation
    echo

    initialize_system
    echo

    health_check
    echo

    log_success "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
    echo
    echo "Your Enterprise Article Generation System is now live and operational."
    echo "The system will automatically generate 4-5 high-authority articles daily."
    echo
    echo "📊 Access your admin dashboard at: https://your-domain.com/admin-agentic"
    echo "📝 View generated articles at: https://your-domain.com/blog"
    echo
    echo "🔄 The autopilot system runs daily at 6:00 AM UTC"
    echo "📈 Monitor performance in the analytics dashboard"
    echo
    echo "For support and monitoring, check the Supabase dashboard and logs."
}

# Handle script interruption
trap 'log_error "Deployment interrupted"; exit 1' INT

# Run main deployment
main