#!/bin/bash

# ARTICLE GENERATION SYSTEM MONITORING
# Real-time monitoring and health check script for the enterprise article system

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENVIRONMENT=${ENVIRONMENT:-"production"}

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Logging functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_metric() { echo -e "${CYAN}📊 $1${NC}"; }

# System health check
check_system_health() {
    log_info "Checking system health..."
    
    # Check Edge Functions
    functions=(
        "advanced-keyword-research"
        "serp-analysis-agent"
        "enterprise-article-generator"
        "autopilot-article-scheduler"
        "content-quality-assurance"
    )
    
    healthy_functions=0
    total_functions=${#functions[@]}
    
    for func in "${functions[@]}"; do
        response=$(curl -s -o /dev/null -w "%{http_code}" \
            -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
            -H "Content-Type: application/json" \
            "$SUPABASE_URL/functions/v1/$func" 2>/dev/null || echo "000")
        
        if [[ "$response" == "200" || "$response" == "405" ]]; then
            log_success "✓ $func: Healthy (HTTP $response)"
            ((healthy_functions++))
        else
            log_error "✗ $func: Unhealthy (HTTP $response)"
        fi
    done
    
    log_metric "System Health: $healthy_functions/$total_functions functions healthy"
    
    if [ $healthy_functions -eq $total_functions ]; then
        return 0
    else
        return 1
    fi
}

# Check database connectivity and recent activity
check_database() {
    log_info "Checking database status..."
    
    # Test database connectivity via Supabase API
    response=$(curl -s -w "%{http_code}" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        -H "Content-Type: application/json" \
        "$SUPABASE_URL/rest/v1/articles?select=count" 2>/dev/null || echo "000")
    
    if [[ "$response" == *"200"* ]]; then
        log_success "Database: Connected and responsive"
        return 0
    else
        log_error "Database: Connection issues (HTTP $(echo $response | tail -c 4))"
        return 1
    fi
}

# Monitor recent article generation activity
monitor_article_generation() {
    log_info "Monitoring article generation activity..."
    
    # Get recent articles (last 24 hours)
    today=$(date -u -d '1 day ago' +"%Y-%m-%dT%H:%M:%SZ")
    
    response=$(curl -s \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        -H "Content-Type: application/json" \
        "$SUPABASE_URL/rest/v1/articles?select=id,title,created_at,status,seo_score&created_at=gte.$today&order=created_at.desc" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ "$response" != "null" ]; then
        article_count=$(echo "$response" | jq length 2>/dev/null || echo "0")
        log_metric "Articles generated today: $article_count"
        
        if [ "$article_count" -gt 0 ]; then
            # Show recent articles
            echo "$response" | jq -r '.[] | "  • \(.title) (SEO: \(.seo_score), Status: \(.status))"' 2>/dev/null | head -5
        fi
        
        # Check if we're meeting daily target (4-5 articles)
        if [ "$article_count" -ge 4 ] && [ "$article_count" -le 6 ]; then
            log_success "Daily article target: Met ($article_count articles)"
        elif [ "$article_count" -lt 4 ]; then
            log_warning "Daily article target: Below target ($article_count/4+ articles)"
        else
            log_warning "Daily article target: Above expected ($article_count articles)"
        fi
    else
        log_error "Unable to fetch article data"
        return 1
    fi
}

# Monitor automation jobs
monitor_automation() {
    log_info "Checking automation job status..."
    
    # Get recent automation jobs
    response=$(curl -s \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        -H "Content-Type: application/json" \
        "$SUPABASE_URL/rest/v1/automation_jobs?select=*&order=created_at.desc&limit=5" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ "$response" != "null" ]; then
        job_count=$(echo "$response" | jq length 2>/dev/null || echo "0")
        
        if [ "$job_count" -gt 0 ]; then
            log_metric "Recent automation jobs: $job_count"
            
            # Show recent job status
            echo "$response" | jq -r '.[] | "  • \(.job_batch_id): \(.status) (\(.articles_generated) articles)"' 2>/dev/null | head -3
            
            # Check for failed jobs
            failed_jobs=$(echo "$response" | jq '[.[] | select(.status == "failed")] | length' 2>/dev/null || echo "0")
            if [ "$failed_jobs" -gt 0 ]; then
                log_warning "Failed automation jobs: $failed_jobs"
            else
                log_success "No failed automation jobs in recent history"
            fi
        else
            log_warning "No recent automation jobs found"
        fi
    else
        log_error "Unable to fetch automation job data"
    fi
}

# Monitor system performance metrics
monitor_performance() {
    log_info "Checking performance metrics..."
    
    # Get article performance stats
    response=$(curl -s \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        -H "Content-Type: application/json" \
        "$SUPABASE_URL/rest/v1/articles?select=seo_score,word_count,views_count,engagement_rate&status=eq.published" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ "$response" != "null" ]; then
        # Calculate averages using jq
        avg_seo=$(echo "$response" | jq '[.[].seo_score] | add / length' 2>/dev/null | cut -d'.' -f1)
        avg_words=$(echo "$response" | jq '[.[].word_count] | add / length' 2>/dev/null | cut -d'.' -f1)
        total_views=$(echo "$response" | jq '[.[].views_count] | add' 2>/dev/null || echo "0")
        
        log_metric "Average SEO Score: ${avg_seo:-0}/100"
        log_metric "Average Word Count: ${avg_words:-0} words"
        log_metric "Total Article Views: ${total_views:-0}"
    fi
}

# Check for system alerts and issues
check_alerts() {
    log_info "Checking for system alerts..."
    
    # Check for articles with low quality scores
    response=$(curl -s \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        -H "Content-Type: application/json" \
        "$SUPABASE_URL/rest/v1/articles?select=title,seo_score&seo_score=lt.60&status=eq.published&limit=5" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ "$response" != "null" ]; then
        low_quality_count=$(echo "$response" | jq length 2>/dev/null || echo "0")
        
        if [ "$low_quality_count" -gt 0 ]; then
            log_warning "Articles with low SEO scores: $low_quality_count"
            echo "$response" | jq -r '.[] | "  • \(.title) (SEO: \(.seo_score))"' 2>/dev/null
        else
            log_success "No low-quality articles detected"
        fi
    fi
    
    # Check for failed content quality checks
    response=$(curl -s \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        -H "Content-Type: application/json" \
        "$SUPABASE_URL/rest/v1/content_quality_checks?select=*&validation_status=eq.failed&limit=3" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ "$response" != "null" ]; then
        failed_checks=$(echo "$response" | jq length 2>/dev/null || echo "0")
        
        if [ "$failed_checks" -gt 0 ]; then
            log_warning "Failed quality checks: $failed_checks"
        else
            log_success "No failed quality checks"
        fi
    fi
}

# Generate system status report
generate_report() {
    echo
    log_info "=== SYSTEM STATUS REPORT ==="
    echo "Generated at: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
    echo "Environment: $ENVIRONMENT"
    echo
    
    # Overall system status
    if check_system_health && check_database; then
        log_success "🟢 SYSTEM STATUS: HEALTHY"
    else
        log_error "🔴 SYSTEM STATUS: ISSUES DETECTED"
    fi
    
    echo
    monitor_article_generation
    echo
    monitor_automation
    echo
    monitor_performance
    echo
    check_alerts
    echo
}

# Continuous monitoring mode
monitor_continuous() {
    log_info "Starting continuous monitoring mode..."
    log_info "Press Ctrl+C to stop"
    echo
    
    while true; do
        clear
        echo -e "${PURPLE}🔍 ENTERPRISE ARTICLE SYSTEM MONITOR${NC}"
        echo "======================================="
        
        generate_report
        
        echo
        log_info "Next check in 60 seconds..."
        sleep 60
    done
}

# Send alert notifications (if configured)
send_alert() {
    local message="$1"
    local severity="$2"
    
    # Add webhook notifications here if needed
    # Example: Slack, Discord, email notifications
    
    log_error "ALERT [$severity]: $message"
}

# Main execution
main() {
    case "${1:-check}" in
        "check"|"")
            generate_report
            ;;
        "continuous"|"watch")
            monitor_continuous
            ;;
        "health")
            if check_system_health && check_database; then
                log_success "System is healthy"
                exit 0
            else
                log_error "System has issues"
                exit 1
            fi
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [check|continuous|health|help]"
            echo
            echo "Commands:"
            echo "  check       - Run single health check (default)"
            echo "  continuous  - Run continuous monitoring"
            echo "  health      - Quick health check (exit code based)"
            echo "  help        - Show this help message"
            ;;
        *)
            log_error "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Handle interruption in continuous mode
trap 'log_info "Monitoring stopped"; exit 0' INT

# Execute main function
main "$@"