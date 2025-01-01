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

# Run linter
lint: ## Run golangci-lint
	@$(LINTER) run


# Check everything
check: fmt lint test ## Run all checks: fmt, lint, and test
	@echo "All checks passed!"


# Run locally
run: ## Run the application locally
	@go run src/main.go

# Build binary
build: ## Build the binary
	@go build backend ./src

# Clean up
clean: ## Clean up generated files
	@rm -rf backend
