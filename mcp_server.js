

const { MCPServer } = require('mcp-server');
const axios = require('axios');

const management_url = "http://51.84.42.17/management";
const management_username = "chaya41182@gmail.com";
const actions = ["update_git", "restart", "get_data", "get_logs", "update_git_restart"];

const performAction = async (action) => {
  return axios.post(`${management_url}/${management_username}/${action}`);
};

const mcp = new MCPServer();

mcp.handle('initialize', async (req) => {
  return {
    capabilities: actions,
    name: 'azran-server-managment',
    description: 'שרת MCP לפעולות ניהול מערכת עזרן'
  };
});

actions.forEach(action => {
  mcp.handle(action, async (req) => {
    if (action === 'update_git_restart') {
      await performAction('update_git');
      const restartResponse = await performAction('restart');
      return { result: restartResponse.data };
    } else {
      const response = await performAction(action);
      return { result: response.data };
    }
  });
});

mcp.listen();
