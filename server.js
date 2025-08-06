import express from 'express';
import axios from 'axios';
const app = express();
const port = 5864;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for the table viewer)
app.use('/static', express.static('public'));

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
  /* Hand2 categories */
  "Does_the_object_fit_the_category_Books_and_Media": "false",
  "Does_the_object_fit_the_category_Business_and_Office": "false",
  "Does_the_object_fit_the_category_Children_and_Babies": "true",
  "Does_the_object_fit_the_category_Clothing_and_Footwear": "false",
  "Does_the_object_fit_the_category_Collectibles_and_Art": "false",
  "Does_the_object_fit_the_category_Electronics": "false",
  "Does_the_object_fit_the_category_Furniture": "true", // Renamed to remove question mark
  "Does_the_object_fit_the_category_General": "false",
  "Does_the_object_fit_the_category_Home_and_Garden": "false",
  "Does_the_object_fit_the_category_Pets": "false",
  "Does_the_object_fit_the_category_Sports_and_Leisure": "false",
  "Does_the_object_fit_the_category_Transportation": "false",
  "city_or_neighborhood": "ירושלים - גבעת שאול",
  "object_name": "עריסת תינוק במצב מצוין",
  "username": "חיה קרמר",
  "Description_of_the_unique_characteristics" : "עריסת תינוק במצב מצוין, מתאימה לתינוקות עד גיל שנה. כוללת מזרן נקי וכיסוי חדש.",
  
  "city": "ירושלים",
  "neighborhood": "גבעת שאול",
  "street": "שדרות בן צבי",
  "name": "חיה קרמר",
  "cities": ["ירושלים", "בני ברק"], 
  "list_of_subjects_for_lesson": [ "מתמטיקה"], 
  "list_of_cities": ["ירושלים", "בני ברק"],
  
  /*news system*/
  "reporter_name": "חיים המלך",
  "reporter_about": "כתב לענייני דיור וכלכלה, עם ניסיון של 10 שנים בתחום.",
  "article_title": "עלייה במחירי הדיור בירושלים: דירות חדשות מגיעות לשיא חדש",
  "article_content": "בירושלים נרשמה השבוע עלייה נוספת במחירי הדיור, כאשר דירות חדשות במרכז העיר מוצעות למכירה במחירים של מעל 6 מיליון שקל. לפי נתוני משרד השיכון, מחירי הדיור עלו ב-8 אחוזים בחודש האחרון בלבד. ראש העיר הודיע על תוכנית חדשה להקמת 2,000 יחידות דיור חדשות באזור גבעת שאול, במטרה להקל על המשבר. הודעה זו התקבלה בברכה על ידי תושבי העיר, אך מומחי נדלן מעריכים שיידרשו מספר שנים עד שהפרויקט ישפיע על המחירים.",
  "article_tags": ["העולם החרדי",  "כלכלה"],
  "content_quality_score": 8,
  "is_appropriate_for_haredi_audience": true,
  "is_news_content": true,
  "rejection_reason": "", 
  "file_url": "http://server.hazran.online/audio/free_arena_voice_files/108002/1fd9f8d2-5fbe-45c5-8e95-658cfb478371.wav",

  
};

// Calculate gmach_data separately after dummyDataPool is fully initialized
dummyDataPool.gmach_data = {
  ...dummyDataPool.gmach_register,
  ...dummyDataPool.location
};

// NOTE: The field "Does_the_object_fit_the_category_Furniture?" was renamed to 
// "Does_the_object_fit_the_category_Furniture" (without question mark) to prevent URL encoding issues

// Utility function to calculate delay based on data size
const calculateDelay = (data) => {
  const jsonString = JSON.stringify(data);
  const sizeInBytes = Buffer.byteLength(jsonString, 'utf8');
  // For example, 1ms per 100 bytes
  return Math.ceil(sizeInBytes * 10);
};

// Storage for async processing
const asyncProcessing = new Map(); // call_id -> { status, result, startTime }

// Cleanup old completed requests (older than 5 minutes)
setInterval(() => {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  for (const [callId, data] of asyncProcessing.entries()) {
    if (data.status === 'completed' && data.startTime < fiveMinutesAgo) {
      asyncProcessing.delete(callId);
      console.log(`Cleaned up completed request: ${callId}`);
    }
  }
}, 60000); // Run cleanup every minute

// Endpoint to get multiple data fields based on query parameters
app.get('/api/analysis', async (req, res) => {
  const startTime = Date.now();
  const { dataNames, call_id } = req.query;
  
  console.log(`[${new Date().toISOString()}] API Request received for: ${dataNames}${call_id ? ` with call_id: ${call_id}` : ''}`);
  
  // Handle async processing with call_id
  if (call_id) {
    // Check if this call_id is already being processed or completed
    if (asyncProcessing.has(call_id)) {
      const processData = asyncProcessing.get(call_id);
      
      if (processData.status === 'processing') {
        console.log(`Request ${call_id} is still processing...`);
        return res.json(null);
      } else if (processData.status === 'completed') {
        console.log(`Request ${call_id} completed, returning result`);
        return res.json(processData.result);
      }
    }
    
    // First time seeing this call_id - start async processing
    asyncProcessing.set(call_id, {
      status: 'processing',
      result: null,
      startTime: Date.now()
    });
    
    console.log(`Starting async processing for call_id: ${call_id}`);
    
    // Return immediate None response
    res.json(null);
    
    // Start background processing
    processRequestInBackground(call_id, dataNames, req.query);
    return;
  }
  
  // Original synchronous processing (without call_id)
  let customValues = {};
  if (req.query.customValues) {
    try {
      customValues = JSON.parse(decodeURIComponent(req.query.customValues));
      console.log(`Custom values provided:`, customValues);
    } catch (error) {
      console.error("Error parsing customValues:", error.message);
      return res.status(400).json({ error: "Invalid customValues format. Must be a URL-encoded JSON object." });
    }
  }
  
  if (!dataNames) {
    return res.status(400).json({ error: "Please provide dataNames query parameter" });
  }

  const keysArray = dataNames.split(',');
  let resultData = {};

  keysArray.forEach((key) => {
    if (customValues[key]) {
      // Use custom value if provided
      resultData[key] = customValues[key];
    } else if (dummyDataPool.hasOwnProperty(key)) {
      // Otherwise use the predefined value
      resultData[key] = dummyDataPool[key];
    }
  });
  
  // Check if file_url is provided in customValues
  const responseData = {
    "analysis_response": {
      "required_data": resultData
    }
  };
  
  // Add file_url if provided
  console.log(`Using file_url from query: ${req.query}`);
  if (req.query.file_url) {
    responseData.analysis_response.file_url = req.query.file_url;
  }else{
    responseData.analysis_response.file_url = dummyDataPool.gmach_data.file_url || "https://example.com/default_file_url.wav";
  }
  
  // Add user_content if provided
  if (req.query.user_content) {
    responseData.analysis_response.user_content = req.query.user_content;
  }
  
  const delayMs = calculateDelay(responseData);
  const dataSizeBytes = Buffer.byteLength(JSON.stringify(responseData), 'utf8');
  
  console.log(`Processing ${keysArray.length} fields, response size: ${dataSizeBytes} bytes`);
  console.log(`Simulating server processing delay: ${delayMs}ms`);
  
  // Add artificial delay to simulate real server processing
  setTimeout(() => {
    const totalTime = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] Response sent after ${totalTime}ms (${delayMs}ms simulated + ${totalTime - delayMs}ms actual processing)`);
    res.json(responseData);
  }, delayMs);
});

// Background processing function
async function processRequestInBackground(call_id, dataNames, queryParams) {
  try {
    console.log(`[${new Date().toISOString()}] Background processing started for ${call_id}`);
    
    // Special handling for hand2 fields - define default values
    const hand2DefaultValues = {
      "Does_the_object_fit_the_category_Books_and_Media": "false",
      "Does_the_object_fit_the_category_Business_and_Office": "false",
      "Does_the_object_fit_the_category_Children_and_Babies": "true",
      "Does_the_object_fit_the_category_Clothing_and_Footwear": "false",
      "Does_the_object_fit_the_category_Collectibles_and_Art": "false",
      "Does_the_object_fit_the_category_Electronics": "false",
      "Does_the_object_fit_the_category_Furniture": "true", // Renamed to remove question mark
      "Does_the_object_fit_the_category_General": "false",
      "Does_the_object_fit_the_category_Home_and_Garden": "false",
      "Does_the_object_fit_the_category_Pets": "false",
      "Does_the_object_fit_the_category_Sports_and_Leisure": "false",
      "Does_the_object_fit_the_category_Transportation": "false",
      "city_or_neighborhood": "ירושלים - גבעת שאול",
      "object_name": "עריסת תינוק במצב מצוין"
    };

    // Debug: Print available fields in dummyDataPool
    console.log(`Available fields in dummyDataPool: ${Object.keys(dummyDataPool).join(', ')}`);
    
    let customValues = {};
    if (queryParams.customValues) {
      try {
        customValues = JSON.parse(decodeURIComponent(queryParams.customValues));
        console.log(`Custom values parsed:`, customValues);
      } catch (error) {
        console.error(`Error parsing customValues for ${call_id}:`, error.message);
      }
    }
    
    if (!dataNames) {
      asyncProcessing.set(call_id, {
        status: 'completed',
        result: { error: "Please provide dataNames query parameter" },
        startTime: asyncProcessing.get(call_id).startTime
      });
      return;
    }

    const keysArray = dataNames.split(',');
    console.log(`Requested fields: ${keysArray.join(', ')}`);
    
    let resultData = {};

    // Check if this is a hand2 request by examining dataNames
    const isHand2Request = dataNames.includes('Does_the_object_fit_the_category_');
    console.log(`Is hand2 request: ${isHand2Request}`);

    keysArray.forEach((key) => {
      if (customValues[key]) {
        console.log(`Using custom value for ${key}: ${customValues[key]}`);
        resultData[key] = customValues[key];
      } else if (dummyDataPool.hasOwnProperty(key)) {
        console.log(`Using dummyDataPool value for ${key}: ${dummyDataPool[key]}`);
        resultData[key] = dummyDataPool[key];
      } else if (hand2DefaultValues.hasOwnProperty(key)) {
        console.log(`Using hand2DefaultValues for ${key}: ${hand2DefaultValues[key]}`);
        resultData[key] = hand2DefaultValues[key];
      } else {
        console.log(`No value found for ${key}`);
      }
    });

    const responseData = {
      "analysis_response": {
        "required_data": resultData,
        "call_id": call_id,
        "processed_at": new Date().toISOString()
      }
    };
    
    // Add file_url if provided
    if (queryParams.file_url) {
      responseData.analysis_response.file_url = queryParams.file_url;
    }else{
      responseData.analysis_response.file_url = dummyDataPool.gmach_data.file_url || "https://example.com/default_file_url.wav";
    }
    
    // Add user_content if provided
    if (queryParams.user_content) {
      responseData.analysis_response.user_content = queryParams.user_content;
    }
    
    const delayMs = calculateDelay(responseData);
    const dataSizeBytes = Buffer.byteLength(JSON.stringify(responseData), 'utf8');
    
    console.log(`Background processing for ${call_id}: ${keysArray.length} fields, ${dataSizeBytes} bytes, ${delayMs}ms delay`);
    
    // Simulate processing delay
    setTimeout(() => {
      asyncProcessing.set(call_id, {
        status: 'completed',
        result: responseData,
        startTime: asyncProcessing.get(call_id).startTime
      });
      
      console.log(`[${new Date().toISOString()}] Background processing completed for ${call_id}`);
    }, delayMs);
    
  } catch (error) {
    console.error(`Error in background processing for ${call_id}:`, error);
    asyncProcessing.set(call_id, {
      status: 'completed',
      result: { error: "Internal processing error" },
      startTime: asyncProcessing.get(call_id).startTime
    });
  }
}

// New endpoint to view tables in a user-friendly format
app.get('/tables', async (req, res) => {
  try {
    // Fetch data from the management API
    const response = await axios.post(`${management_url}/${management_username}/get_data`);
    const { call_data, data } = response.data;

    // HTML template for the table viewer
    const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>צפייה בטבלאות נתונים</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            direction: rtl;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .tabs {
            display: flex;
            background: #34495e;
        }
        .tab {
            flex: 1;
            padding: 15px;
            background: #34495e;
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .tab:hover {
            background: #4a6741;
        }
        .tab.active {
            background: #3498db;
        }
        .table-container {
            padding: 20px;
            max-height: 600px;
            overflow-y: auto;
        }
        .search-box {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            direction: rtl;
        }
        .column-filter {
            width: 100%;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 12px;
            direction: rtl;
            margin-top: 5px;
        }
        .filter-header {
            background: #f1f3f4 !important;
            vertical-align: top;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }
        th, td {
            padding: 8px 12px;
            text-align: right;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #f8f9fa;
            font-weight: bold;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        tr:hover {
            background: #f5f5f5;
        }
        .stats {
            margin-bottom: 15px;
            padding: 10px;
            background: #e8f4fd;
            border-radius: 4px;
            direction: rtl;
        }
        .hidden {
            display: none;
        }
        .no-data {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        .clear-filters-btn {
            background: #e74c3c;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 10px;
            margin-left: 10px;
            font-size: 14px;
        }
        .reset-sort-btn {
            background: #9b59b6;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .reset-sort-btn:hover {
            background: #8e44ad;
        }
        .instructions {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 10px;
            margin-bottom: 15px;
            font-size: 14px;
            color: #495057;
        }
        .instructions strong {
            color: #2c3e50;
        }
        .clear-filters-btn:hover {
            background: #c0392b;
        }
        .sortable {
            cursor: pointer;
            position: relative;
            user-select: none;
        }
        .sortable:hover {
            background: #e8f4fd;
        }
        .sort-arrow {
            position: absolute;
            left: 5px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
            color: #666;
        }
        .sort-asc::after {
            content: ' ↑';
            color: #2c3e50;
            font-weight: bold;
        }
        .sort-desc::after {
            content: ' ↓';
            color: #2c3e50;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>צפייה בטבלאות נתונים</h1>
        </div>
        
        <div class="tabs">
            <button class="tab active" onclick="showTable('call_data')">
                נתוני קריאות (call_data) - ${call_data.length} רשומות
            </button>
            <button class="tab" onclick="showTable('data')">
                נתונים נוספים (data) - ${data.length} רשומות
            </button>
        </div>

        <div id="call_data_container" class="table-container">
            <div class="instructions">
                <strong>הוראות שימוש:</strong> לחץ על כותרת עמודה למיון (↑ עולה, ↓ יורד, לחיצה שלישית מבטלת). 
                השתמש בתיבות הסינון מתחת לכותרות לסינון ספציפי.
            </div>
            <input type="text" class="search-box" placeholder="חיפוש כללי בטבלה..." 
                   onkeyup="filterTable('call_data_table', this.value)">
            <button class="reset-sort-btn" onclick="resetSort('call_data_table')">
                איפוס מיון
            </button>
            <button class="clear-filters-btn" onclick="clearAllFilters('call_data_table')">
                נקה את כל הסינונים
            </button>
            <div class="stats" id="call_data_stats">
                סה"כ רשומות: ${call_data.length}
            </div>
            <table id="call_data_table">
                <thead>
                    <tr>
                        <th class="sortable" onclick="sortTable('call_data_table', 0)">Call ID</th>
                        <th class="sortable" onclick="sortTable('call_data_table', 1)">תאריך</th>
                        <th class="sortable" onclick="sortTable('call_data_table', 2)">ID</th>
                        <th class="sortable" onclick="sortTable('call_data_table', 3)">מפתח</th>
                        <th class="sortable" onclick="sortTable('call_data_table', 4)">Local ID</th>
                        <th class="sortable" onclick="sortTable('call_data_table', 5)">Route ID</th>
                        <th class="sortable" onclick="sortTable('call_data_table', 6)">ערך</th>
                    </tr>
                    <tr class="filter-header">
                        <th><input type="text" class="column-filter" placeholder="סנן Call ID..." onkeyup="filterByColumn('call_data_table', 0, this.value)"></th>
                        <th><input type="text" class="column-filter" placeholder="סנן תאריך..." onkeyup="filterByColumn('call_data_table', 1, this.value)"></th>
                        <th><input type="text" class="column-filter" placeholder="סנן ID..." onkeyup="filterByColumn('call_data_table', 2, this.value)"></th>
                        <th><input type="text" class="column-filter" placeholder="סנן מפתח..." onkeyup="filterByColumn('call_data_table', 3, this.value)"></th>
                        <th><input type="text" class="column-filter" placeholder="סנן Local ID..." onkeyup="filterByColumn('call_data_table', 4, this.value)"></th>
                        <th><input type="text" class="column-filter" placeholder="סנן Route ID..." onkeyup="filterByColumn('call_data_table', 5, this.value)"></th>
                        <th><input type="text" class="column-filter" placeholder="סנן ערך..." onkeyup="filterByColumn('call_data_table', 6, this.value)"></th>
                    </tr>
                </thead>
                <tbody>
                    ${call_data.map(row => `
                        <tr>
                            <td>${row.call_id || ''}</td>
                            <td>${row.date ? new Date(row.date * 1000).toLocaleString('he-IL') : ''}</td>
                            <td>${row.id || ''}</td>
                            <td>${row.key || ''}</td>
                            <td>${row.local_id || ''}</td>
                            <td>${row.route_id || ''}</td>
                            <td>${row.value || ''}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div id="data_container" class="table-container hidden">
            <div class="instructions">
                <strong>הוראות שימוש:</strong> לחץ על כותרת עמודה למיון (↑ עולה, ↓ יורד, לחיצה שלישית מבטלת). 
                השתמש בתיבות הסינון מתחת לכותרות לסינון ספציפי.
            </div>
            <input type="text" class="search-box" placeholder="חיפוש כללי בטבלה..." 
                   onkeyup="filterTable('data_table', this.value)">
            <button class="reset-sort-btn" onclick="resetSort('data_table')">
                איפוס מיון
            </button>
            <button class="clear-filters-btn" onclick="clearAllFilters('data_table')">
                נקה את כל הסינונים
            </button>
            <div class="stats" id="data_stats">
                סה"כ רשומות: ${data.length}
            </div>
            <table id="data_table">
                <thead>
                    <tr>
                        <th class="sortable" onclick="sortTable('data_table', 0)">Call ID</th>
                        <th class="sortable" onclick="sortTable('data_table', 1)">תאריך</th>
                        <th class="sortable" onclick="sortTable('data_table', 2)">ID</th>
                        <th class="sortable" onclick="sortTable('data_table', 3)">מפתח</th>
                        <th class="sortable" onclick="sortTable('data_table', 4)">Local ID</th>
                        <th class="sortable" onclick="sortTable('data_table', 5)">Route ID</th>
                        <th class="sortable" onclick="sortTable('data_table', 6)">ערך</th>
                    </tr>
                    <tr class="filter-header">
                        <th><input type="text" class="column-filter" placeholder="סנן Call ID..." onkeyup="filterByColumn('data_table', 0, this.value)"></th>
                        <th><input type="text" class="column-filter" placeholder="סנן תאריך..." onkeyup="filterByColumn('data_table', 1, this.value)"></th>
                        <th><input type="text" class="column-filter" placeholder="סנן ID..." onkeyup="filterByColumn('data_table', 2, this.value)"></th>
                        <th><input type="text" class="column-filter" placeholder="סנן מפתח..." onkeyup="filterByColumn('data_table', 3, this.value)"></th>
                        <th><input type="text" class="column-filter" placeholder="סנן Local ID..." onkeyup="filterByColumn('data_table', 4, this.value)"></th>
                        <th><input type="text" class="column-filter" placeholder="סנן Route ID..." onkeyup="filterByColumn('data_table', 5, this.value)"></th>
                        <th><input type="text" class="column-filter" placeholder="סנן ערך..." onkeyup="filterByColumn('data_table', 6, this.value)"></th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            <td>${row.call_id || ''}</td>
                            <td>${row.date ? new Date(row.date * 1000).toLocaleString('he-IL') : ''}</td>
                            <td>${row.id || ''}</td>
                            <td>${row.key || ''}</td>
                            <td>${row.local_id || ''}</td>
                            <td>${row.route_id || ''}</td>
                            <td>${row.value || ''}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>

    <script>
        // Global sorting state
        let sortState = {
            call_data_table: { column: -1, direction: 'none' },
            data_table: { column: -1, direction: 'none' }
        };

        function showTable(tableName) {
            // Hide all containers
            document.getElementById('call_data_container').classList.add('hidden');
            document.getElementById('data_container').classList.add('hidden');
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            
            // Show selected container and activate tab
            document.getElementById(tableName + '_container').classList.remove('hidden');
            event.target.classList.add('active');
        }

        function filterTable(tableId, searchValue) {
            const table = document.getElementById(tableId);
            const rows = table.getElementsByTagName('tr');
            let visibleCount = 0;
            
            // Start from 2 to skip header row and filter row
            for (let i = 2; i < rows.length; i++) {
                const row = rows[i];
                const cells = row.getElementsByTagName('td');
                let found = false;
                
                // Search in all cells
                for (let j = 0; j < cells.length; j++) {
                    if (cells[j].textContent.toLowerCase().includes(searchValue.toLowerCase())) {
                        found = true;
                        break;
                    }
                }
                
                if (found || searchValue === '') {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            }
            
            // Update stats
            const statsId = tableId.replace('_table', '_stats');
            const totalCount = tableId === 'call_data_table' ? ${call_data.length} : ${data.length};
            document.getElementById(statsId).textContent = 
                \`מציג \${visibleCount} מתוך \${totalCount} רשומות\`;
        }

        function filterByColumn(tableId, columnIndex, searchValue) {
            const table = document.getElementById(tableId);
            const rows = table.getElementsByTagName('tr');
            let visibleCount = 0;
            
            // Get all active column filters
            const filterInputs = table.querySelectorAll('.column-filter');
            const activeFilters = {};
            filterInputs.forEach((input, index) => {
                if (input.value.trim() !== '') {
                    activeFilters[index] = input.value.toLowerCase();
                }
            });
            
            // Start from 2 to skip header row and filter row
            for (let i = 2; i < rows.length; i++) {
                const row = rows[i];
                const cells = row.getElementsByTagName('td');
                let showRow = true;
                
                // Check all active filters
                for (let colIndex in activeFilters) {
                    const cellText = cells[colIndex] ? cells[colIndex].textContent.toLowerCase() : '';
                    if (!cellText.includes(activeFilters[colIndex])) {
                        showRow = false;
                        break;
                    }
                }
                
                if (showRow) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            }
            
            // Update stats
            const statsId = tableId.replace('_table', '_stats');
            const totalCount = tableId === 'call_data_table' ? ${call_data.length} : ${data.length};
            document.getElementById(statsId).textContent = 
                \`מציג \${visibleCount} מתוך \${totalCount} רשומות (מסונן)\`;
        }

        function clearAllFilters(tableId) {
            const table = document.getElementById(tableId);
            const filterInputs = table.querySelectorAll('.column-filter');
            const searchBox = table.closest('.table-container').querySelector('.search-box');
            
            // Clear all filter inputs
            filterInputs.forEach(input => input.value = '');
            if (searchBox) searchBox.value = '';
            
            // Show all rows
            const rows = table.getElementsByTagName('tr');
            for (let i = 2; i < rows.length; i++) {
                rows[i].style.display = '';
            }
            
            // Update stats
            const statsId = tableId.replace('_table', '_stats');
            const totalCount = tableId === 'call_data_table' ? ${call_data.length} : ${data.length};
            document.getElementById(statsId).textContent = 
                \`סה"כ רשומות: \${totalCount}\`;
        }

        function sortTable(tableId, columnIndex) {
            const table = document.getElementById(tableId);
            const tbody = table.tBodies[0];
            const rows = Array.from(tbody.rows);
            const headers = table.querySelectorAll('th.sortable');
            
            // Remove previous sorting indicators
            headers.forEach(header => {
                header.classList.remove('sort-asc', 'sort-desc');
            });
            
            // Determine sort direction
            let direction = 'asc';
            if (sortState[tableId].column === columnIndex) {
                if (sortState[tableId].direction === 'asc') {
                    direction = 'desc';
                } else if (sortState[tableId].direction === 'desc') {
                    direction = 'none';
                } else {
                    direction = 'asc';
                }
            }
            
            // Update sort state
            sortState[tableId] = { column: columnIndex, direction: direction };
            
            if (direction === 'none') {
                // Reset to original order - reload the page would be needed for true original order
                // For now, we'll just not sort
                return;
            }
            
            // Add sorting indicator to current column
            headers[columnIndex].classList.add(direction === 'asc' ? 'sort-asc' : 'sort-desc');
            
            // Sort rows
            rows.sort((a, b) => {
                const aText = a.cells[columnIndex].textContent.trim();
                const bText = b.cells[columnIndex].textContent.trim();
                
                // Try to parse as numbers first
                const aNum = parseFloat(aText);
                const bNum = parseFloat(bText);
                
                let comparison = 0;
                
                if (!isNaN(aNum) && !isNaN(bNum)) {
                    // Numeric comparison
                    comparison = aNum - bNum;
                } else {
                    // String comparison
                    comparison = aText.localeCompare(bText, 'he');
                }
                
                return direction === 'asc' ? comparison : -comparison;
            });
            
            // Clear tbody and re-append sorted rows
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
            
            rows.forEach(row => tbody.appendChild(row));
            
            // Update visible count after sorting (in case filters are active)
            updateVisibleCount(tableId);
        }
        
        function updateVisibleCount(tableId) {
            const table = document.getElementById(tableId);
            const rows = table.getElementsByTagName('tr');
            let visibleCount = 0;
            
            // Count visible rows (skip header and filter rows)
            for (let i = 2; i < rows.length; i++) {
                if (rows[i].style.display !== 'none') {
                    visibleCount++;
                }
            }
            
            const statsId = tableId.replace('_table', '_stats');
            const totalCount = tableId === 'call_data_table' ? ${call_data.length} : ${data.length};
            
            // Check if any filters are active
            const filterInputs = table.querySelectorAll('.column-filter');
            const searchBox = table.closest('.table-container').querySelector('.search-box');
            let hasActiveFilters = false;
            
            filterInputs.forEach(input => {
                if (input.value.trim() !== '') hasActiveFilters = true;
            });
            
            if (searchBox && searchBox.value.trim() !== '') hasActiveFilters = true;
            
            const statusText = hasActiveFilters ? 
                \`מציג \${visibleCount} מתוך \${totalCount} רשומות (מסונן)\` :
                \`סה"כ רשומות: \${totalCount}\`;
                
            document.getElementById(statsId).textContent = statusText;
        }

        function resetSort(tableId) {
            // Reset sort state
            sortState[tableId] = { column: -1, direction: 'none' };
            
            // Remove sorting indicators
            const table = document.getElementById(tableId);
            const headers = table.querySelectorAll('th.sortable');
            headers.forEach(header => {
                header.classList.remove('sort-asc', 'sort-desc');
            });
            
            // Reload the page to restore original order
            location.reload();
        }
    </script>
</body>
</html>`;

    res.send(html);
  } catch (error) {
    console.error('Error fetching table data:', error.message);
    res.status(500).send(`
      <html dir="rtl">
        <body style="font-family: Arial; padding: 20px; text-align: center;">
          <h2>שגיאה בטעינת הנתונים</h2>
          <p>לא ניתן לטעון את הנתונים מהשרת</p>
          <p>שגיאה: ${error.message}</p>
        </body>
      </html>
    `);
  }
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
  
  // Standard synchronous URL
  console.log(`\n=== Standard Synchronous Request ===`);
  console.log(`URL: http://localhost:${port}/api/analysis?dataNames=${Object.keys(dummyDataPool).join(',')}`);
  
  // Asynchronous URL with unique call_id examples
  console.log(`\n=== Asynchronous Request with call_id ===`);
  console.log(`First request (returns null): http://localhost:${port}/api/analysis?call_id=test-123-456&dataNames=reporter_name,article_title`);
  console.log(`Subsequent requests (returns result when ready): http://localhost:${port}/api/analysis?call_id=test-123-456`);
  console.log(`Note: Generate a unique call_id for each new request series (UUID recommended)`);
  
  // Hand2 categories example
  console.log(`\n=== Hand2 Categories Request Example ===`);
  console.log(`URL: http://localhost:${port}/api/analysis?call_id=hand2-request-123&dataNames=Does_the_object_fit_the_category_Books_and_Media,Does_the_object_fit_the_category_Business_and_Office,Does_the_object_fit_the_category_Children_and_Babies,Does_the_object_fit_the_category_Clothing_and_Footwear,Does_the_object_fit_the_category_Collectibles_and_Art,Does_the_object_fit_the_category_Electronics,Does_the_object_fit_the_category_Furniture,Does_the_object_fit_the_category_General,Does_the_object_fit_the_category_Home_and_Garden,Does_the_object_fit_the_category_Pets,Does_the_object_fit_the_category_Sports_and_Leisure,Does_the_object_fit_the_category_Transportation,city_or_neighborhood,object_name`);
  
  // Create properly encoded example URL with custom values
  const exampleCustomValues = JSON.stringify({"reporter_name":"שם אחר", "article_title":"כותרת מותאמת אישית"});
  const encodedCustomValues = encodeURIComponent(exampleCustomValues);
  console.log(`\n=== Custom Values Example ===`);
  console.log(`URL: http://localhost:${port}/api/analysis?dataNames=reporter_name,article_title&customValues=${encodedCustomValues}`);
  
  // Hand2 custom values example
  const hand2CustomValues = JSON.stringify({
    "Does_the_object_fit_the_category_Books_and_Media": "false",
    "Does_the_object_fit_the_category_Business_and_Office": "false",
    "Does_the_object_fit_the_category_Electronics": "true",
    "object_name": "מחשב נייד חדש - HP ProBook"
  });
  const encodedHand2Values = encodeURIComponent(hand2CustomValues);
  console.log(`\n=== Hand2 Custom Values Example ===`);
  console.log(`URL: http://localhost:${port}/api/analysis?call_id=hand2-laptop-123&dataNames=Does_the_object_fit_the_category_Books_and_Media,Does_the_object_fit_the_category_Business_and_Office,Does_the_object_fit_the_category_Electronics,object_name&customValues=${encodedHand2Values}`);
  
  // Async with custom values
  console.log(`\n=== Asynchronous Request with Custom Values ===`);
  console.log(`URL: http://localhost:${port}/api/analysis?call_id=test-custom-123&dataNames=reporter_name,article_title&customValues=${encodedCustomValues}`);
  
  // File URL example
  console.log(`\n=== Request with File URL ===`);
  console.log(`URL: http://localhost:${port}/api/analysis?dataNames=content_quality_score&file_url=http://example.com/file.wav`);
  
  // New table viewer endpoint
  console.log(`\n=== Table Viewer ===`);
  console.log(`URL: http://localhost:${port}/tables`);
  console.log('View database tables with search and filtering capabilities');
});