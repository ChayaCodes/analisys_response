import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import { z } from "zod";

const management_url = "http://51.84.42.17/management";
const management_username = "chaya41182@gmail.com";
const actions = ["update_git", "restart", "get_data", "get_logs", "update_git_restart"];

const performAction = async (action) => {
  return axios.post(`${management_url}/${management_username}/${action}`);
};

const server = new McpServer({
  name: "azran-server-managment",
  version: "1.0.0"
});

// MCP tools
server.registerTool(
  "update_git",
  {
    title: "Update Git",
    description: "עדכון קוד מהגיט",
    inputSchema: z.object({})
  },
  async () => {
    const response = await performAction("update_git");
    return { content: [{ type: "text", text: JSON.stringify(response.data) }] };
  }
);

server.registerTool(
  "restart",
  {
    title: "Restart Server",
    description: "הפעלת שרת מחדש",
    inputSchema: z.object({})
  },
  async () => {
    const response = await performAction("restart");
    return { content: [{ type: "text", text: JSON.stringify(response.data) }] };
  }
);

server.registerTool(
  "get_data",
  {
    title: "Get Data",
    description: "קבלת נתונים",
    inputSchema: z.object({})
  },
  async () => {
    const response = await performAction("get_data");
    return { content: [{ type: "text", text: JSON.stringify(response.data) }] };
  }
);

server.registerTool(
  "get_logs",
  {
    title: "Get Logs",
    description: "קבלת לוגיםם מהשרת",
    inputSchema: z.object({})
  },
  async () => {
    const response = await performAction("get_logs");
    return { content: [{ type: "text", text: JSON.stringify(response.data) }] };
  }
);

server.registerTool(
  "update_git_restart",
  {
    title: "Update Git & Restart",
    description: "עדכון גיט והפעלה מחדש",
    inputSchema: z.object({})
  },
  async () => {
    await performAction("update_git");
    const response = await performAction("restart");
    return { content: [{ type: "text", text: JSON.stringify(response.data) }] };
  }
);

// Start MCP server on stdio
const transport = new StdioServerTransport();
await server.connect(transport);
// ניתן להדפיס ל-stderr אם רוצים לוגים:
// console.error("MCP server is running...");
