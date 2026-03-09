.PHONY: serve help clean

# Default target
help:
	@echo "Available commands:"
	@echo "  make serve    - Start a local web server on port 8000"
	@echo "  make help     - Show this help message"

# Start local development server
serve:
	@echo "Starting local server at http://localhost:8000"
	@echo "Press Ctrl+C to stop the server"
	@python3 -m http.server 8000

# Clean temporary files (if any)
clean:
	@find . -type f -name '.DS_Store' -delete
	@echo "Cleaned temporary files"
