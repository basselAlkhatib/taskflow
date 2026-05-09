# Figma MCP Server

An MCP (Model Context Protocol) server that provides tools to interact with the Figma API, allowing AI assistants like Cursor to query and manipulate Figma files.

## Features

- Get Figma file data
- Retrieve file components
- Get team projects
- Create new files by duplicating existing ones
- Get image exports from files

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get Figma Access Token:**
   - Go to https://www.figma.com/developers/api#access-tokens
   - Create a new personal access token
   - Copy the token

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your FIGMA_ACCESS_TOKEN
   ```

4. **Build the server:**
   ```bash
   npm run build
   ```

5. **Run the server:**
   ```bash
   npm start
   ```

## Usage with Cursor

To use this MCP server with Cursor:

1. In Cursor, go to Settings > MCP Servers
2. Add a new server with:
   - Name: Figma MCP Server
   - Command: `node /path/to/figma-mcp-server/dist/index.js`
   - Make sure the .env file is in the same directory or set the FIGMA_ACCESS_TOKEN environment variable

## Available Tools

### get_figma_file
Retrieve a complete Figma file by its key.

**Input:**
- `file_key`: The Figma file key (from the URL)

### get_file_components
Get all components in a Figma file.

**Input:**
- `file_key`: The Figma file key

### get_team_projects
Retrieve all projects in a Figma team.

**Input:**
- `team_id`: The Figma team ID

### create_file_from_duplicate
Create a new Figma file by duplicating an existing file.

**Input:**
- `file_key`: Key of the file to duplicate
- `name` (optional): Name for the new file
- `parent_id` (optional): ID of the parent project

### get_file_images
Get image URLs for specific nodes in a Figma file.

**Input:**
- `file_key`: The Figma file key
- `node_ids` (optional): Comma-separated list of node IDs
- `format` (optional): Image format (png, jpg, svg, pdf)
- `scale` (optional): Image scale

## Figma API Documentation

For more information about the Figma API, see: https://www.figma.com/developers/api

## License

MIT