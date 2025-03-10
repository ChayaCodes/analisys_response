const express = require('express');
const axios = require('axios');
const app = express();
const port = 5864;

// Dummy data for Gmachim service with categories as key-boolean pairs
const dummyDataPool = {
  "gmach_register": {
    "Arrival or call times": "",
    "Does the object fit the category Assistance for New Mothers and the Sick?": "false",
    "Does the object fit the category Babies?": "true",
    "Does the object fit the category Baking Accessories?": "false",
    "Does the object fit the category Bedding, Blankets, and Pillows?": "false",
    "Does the object fit the category Bernshild Bandages?": "false",
    "Does the object fit the category Bride Accessories?": "false",
    "Does the object fit the category Bridesmaids?": "false",
    "Does the object fit the category Candles?": "false",
    "Does the object fit the category Cardboards?": "false",
    "Does the object fit the category Celebrations - Accessories and Products?": "false",
    "Does the object fit the category Charms and Prayers?": "false",
    "Does the object fit the category Circumcision Items?": "false",
    "Does the object fit the category Clothing?": "false",
    "Does the object fit the category Consultation Services?": "false",
    "Does the object fit the category Costumes?": "false",
    "Does the object fit the category Cradles?": "false",
    "Does the object fit the category Electrical Appliances?": "false",
    "Does the object fit the category Email?": "false",
    "Does the object fit the category Fax, Email, and Printing?": "false",
    "Does the object fit the category Glasses and Accessories?": "false",
    "Does the object fit the category Havdalah Items?": "false",
    "Does the object fit the category Holy Books?": "false",
    "Does the object fit the category Laundry and Ironing?": "false",
    "Does the object fit the category Libraries?": "false",
    "Does the object fit the category Loans?": "false",
    "Does the object fit the category Lost and Found?": "false",
    "Does the object fit the category Maps?": "false",
    "Does the object fit the category Matchmaking?": "false",
    "Does the object fit the category Mattresses and Folding Beds?": "false",
    "Does the object fit the category Meals?": "false",
    "Does the object fit the category Medical Equipment?": "false",
    "Does the object fit the category Medicines?": "false",
    "Does the object fit the category Mezuzot?": "false",
    "Does the object fit the category Milk?": "false",
    "Does the object fit the category Miscellaneous?": "false",
    "Does the object fit the category Missing Children?": "false",
    "Does the object fit the category Mourning Items?": "false",
    "Does the object fit the category Photography and Photography Accessories?": "false",
    "Does the object fit the category Printing and Laminating?": "false",
    "Does the object fit the category Psalms?": "false",
    "Does the object fit the category Sabbath Essentials?": "false",
    "Does the object fit the category Sabbath Platters?": "false",
    "Does the object fit the category Second-Hand Furniture?": "false",
    "Does the object fit the category Speakers, Projectors, and Amplification Equipment?": "false",
    "Does the object fit the category Suitcases?": "false",
    "Does the object fit the category Tables and Chairs?": "false",
    "Does the object fit the category Tapes and Disks?": "false",
    "Does the object fit the category Tefillin and Tallitot?": "false",
    "Does the object fit the category Telephone Books?": "false",
    "Does the object fit the category Telephone Devices?": "false",
    "Does the object fit the category Tools?": "false",
    "Does the object fit the category Vehicle and Travel Equipment?": "false",
    "Does the object fit the category Visiting the Sick?": "false",
    "full_gmach_services": "השאלת עריסות גם לתקופות ארוכות",
    "gmach_name": "גמח עריסות"
  },
  "city": "ירושלים",
  "neighborhood": "גבעת שאול",
  "street": "שדרות בן צבי",
  "name": "חיה קרמר",
  "cities": ["ירושלים", "בני ברק"], 
  "list_of_subjects_for_lesson": [ "מתמטיקה"], 
  "list_of_cities": ["ירושלים", "בני ברק"],
  
};

// Calculate gmach_data separately after dummyDataPool is fully initialized
dummyDataPool.gmach_data = {
  ...dummyDataPool.gmach_register,
  ...dummyDataPool.location
};

// Utility function to calculate delay based on data size
const calculateDelay = (data) => {
  const jsonString = JSON.stringify(data);
  const sizeInBytes = Buffer.byteLength(jsonString, 'utf8');
  // For example, 1ms per 100 bytes
  return Math.ceil(sizeInBytes * 10);
};

// Endpoint to get multiple data fields based on query parameters
app.get('/api/analysis', (req, res) => {
  const { dataNames } = req.query;
  if (!dataNames) {
    return res.status(400).json({ error: "Please provide dataNames query parameter" });
  }

  const keysArray = dataNames.split(',');
  let resultData = {};

  keysArray.forEach((key) => {
    if (dummyDataPool.hasOwnProperty(key)) {
      resultData[key] = dummyDataPool[key];
    }
  });

  res.json({
    "analysis_response": {
      "required_data": resultData
    }
  });
});

const management_url = "http://51.84.42.17/management";
const management_username = "chaya41182@gmail.com";
const actions = ["update_git", "restart", "get_data", "get_logs"];

const performAction = (action) => {
  return axios.post(`${management_url}/${management_username}/${action}`);
};

const handleAction = async (action, res) => {
  try {
    if (action === 'update') {
      const updateGitResponse = await performAction('update_git');
      console.log(`update_git response: ${updateGitResponse.data}`);
      const restartResponse = await performAction('restart');
      console.log(`restart response: ${restartResponse.data}`);
      res.json(restartResponse.data);
    } else {
      const response = await performAction(action);
      console.log(`Response received: ${response.data}`);
      res.json(response.data);
    }
  } catch (error) {
    console.error(`Error occurred: ${error.message}`);
    res.status(500).json({
      "error": "Internal server error"
    });
  }
};

app.get('/action/:action', (req, res) => {
  const { action } = req.params;
  const actions = ["update_git", "restart", "get_data", "get_logs", "update"];

  if (actions.includes(action)) {
    handleAction(action, res);
  } else {
    console.log(`Action not found: ${action}`);
    res.status(404).json({
      "error": "Action not found"
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});