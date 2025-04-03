# Variables
LINTER = golangci-lint

# Default target
.DEFAULT_GOAL := help

# Help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# Format code
fmt: ## Format code with gofmt
	@gofmt -l -w .

# Check linter
lint-check: ## Check code using golangci-lint (no output if clean)
	@$(LINTER) run --quiet

# Run linter
lint: ## Run golangci-lint
	@$(LINTER) run

# Run gosec for security analysis
gosec: 
	@gosec ./...

# Поиск теней, ошибок и др. через go vet
vet:
	@echo "🔍 Running go vet..."
	@go vet ./...
# Fix linter issues
lint-fix: ## Run golangci-lint with auto-fix
	@$(LINTER) run --fix


# Check everything
check: fmt lint test ## Run all checks: fmt, lint, and test
	@echo "All checks passed!"


# Run locally
run: ## Run the application locally
	@go run src/main.go

# Run Script locally
run-script: ## Run the Script locally
	@go run src/script/script.go

# Build binary
build: ## Build the binary
	@go build -o backend ./src

# Clean up
clean: ## Clean up generated files
	@rm -rf backend
