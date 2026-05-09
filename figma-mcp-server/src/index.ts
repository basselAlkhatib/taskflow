#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

if (!FIGMA_ACCESS_TOKEN) {
  console.error("FIGMA_ACCESS_TOKEN environment variable is required");
  process.exit(1);
}

// Figma API client
const figmaApi = axios.create({
  baseURL: "https://api.figma.com/v1",
  headers: {
    "X-Figma-Token": FIGMA_ACCESS_TOKEN,
  },
});

// Server setup
const server = new McpServer({
  name: "figma-mcp-server",
  version: "1.0.0",
});

// Tool: Get Figma file
server.registerTool(
  "get_figma_file",
  {
    title: "Get Figma File",
    description: "Retrieve a Figma file by its key, including all nodes and their properties.",
    inputSchema: {
      file_key: z.string().describe("The Figma file key (from the URL)"),
    },
    outputSchema: z.object({
      file: z.any().describe("The complete Figma file data"),
    }),
  },
  async (args) => {
    try {
      const response = await figmaApi.get(`/files/${args.file_key}`);
      return {
        content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.response?.data?.message || error.message}` }],
        isError: true,
      };
    }
  }
);

// Tool: Get file components
server.registerTool(
  "get_file_components",
  {
    title: "Get File Components",
    description: "Retrieve all components in a Figma file.",
    inputSchema: {
      file_key: z.string().describe("The Figma file key"),
    },
    outputSchema: z.object({
      components: z.any().describe("The components data"),
    }),
  },
  async (args) => {
    try {
      const response = await figmaApi.get(`/files/${args.file_key}/components`);
      return {
        content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.response?.data?.message || error.message}` }],
        isError: true,
      };
    }
  }
);

// Tool: Get team projects
server.registerTool(
  "get_team_projects",
  {
    title: "Get Team Projects",
    description: "Retrieve all projects in a Figma team.",
    inputSchema: {
      team_id: z.string().describe("The Figma team ID"),
    },
    outputSchema: z.object({
      projects: z.any().describe("The projects data"),
    }),
  },
  async (args) => {
    try {
      const response = await figmaApi.get(`/teams/${args.team_id}/projects`);
      return {
        content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.response?.data?.message || error.message}` }],
        isError: true,
      };
    }
  }
);

// Tool: Create file (duplicate existing file)
server.registerTool(
  "create_file_from_duplicate",
  {
    title: "Create File from Duplicate",
    description: "Create a new Figma file by duplicating an existing file.",
    inputSchema: {
      file_key: z.string().describe("The key of the file to duplicate"),
      name: z.string().optional().describe("Name for the new file"),
      parent_id: z.string().optional().describe("ID of the parent project"),
    },
    outputSchema: z.object({
      new_file: z.any().describe("The new file data"),
    }),
  },
  async (args) => {
    try {
      const data: any = {};
      if (args.name) data.name = args.name;
      if (args.parent_id) data.parent_id = args.parent_id;

      const response = await figmaApi.post(`/files/${args.file_key}/duplicate`, data);
      return {
        content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.response?.data?.message || error.message}` }],
        isError: true,
      };
    }
  }
);

// Tool: Get file images
server.registerTool(
  "get_file_images",
  {
    title: "Get File Images",
    description: "Retrieve image URLs for specific nodes in a Figma file.",
    inputSchema: {
      file_key: z.string().describe("The Figma file key"),
      node_ids: z.string().optional().describe("Comma-separated list of node IDs"),
      format: z.enum(["png", "jpg", "svg", "pdf"]).optional().default("png").describe("Image format"),
      scale: z.number().optional().default(1).describe("Image scale"),
    },
    outputSchema: z.object({
      images: z.any().describe("The images data with URLs"),
    }),
  },
  async (args) => {
    try {
      const params: any = {
        format: args.format,
        scale: args.scale,
      };
      if (args.node_ids) params.ids = args.node_ids;

      const response = await figmaApi.get(`/images/${args.file_key}`, { params });
      return {
        content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.response?.data?.message || error.message}` }],
        isError: true,
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Figma MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});