// Test script for file_url support
const axios = require('axios');

const BASE_URL = 'http://localhost:5864';

async function testFileUrl() {
    console.log('=== Testing file_url support ===\n');
    
    const dataNames = 'subject';
    const file_url = "http://server.hazran.online/audio/free_arena_voice_files/108002/1fd9f8d2-5fbe-45c5-8e95-658cfb478371.wav";
    const user_content = "היסטוריה";
    
    try {
        // Test 1: Synchronous request with file_url
        console.log('Test 1: Synchronous request with file_url');
        const response1 = await axios.get(`${BASE_URL}/api/analysis`, {
            params: {
                dataNames,
                file_url,
                user_content
            }
        });
        
        console.log('Response:', JSON.stringify(response1.data, null, 2));
        console.log('---\n');
        
        // Test 2: Asynchronous request with file_url
        console.log('Test 2: Asynchronous request with file_url');
        const call_id = `file_test_${Date.now()}`;
        
        const response2 = await axios.get(`${BASE_URL}/api/analysis`, {
            params: {
                dataNames,
                file_url,
                user_content,
                call_id
            }
        });
        
        console.log('Initial response:', JSON.stringify(response2.data, null, 2));
        console.log('Waiting 5 seconds for processing...');
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const response3 = await axios.get(`${BASE_URL}/api/analysis`, {
            params: {
                dataNames,
                file_url,
                user_content,
                call_id
            }
        });
        
        console.log('Final response:', JSON.stringify(response3.data, null, 2));
        
    } catch (error) {
        console.error('Error during testing:', error.response?.data || error.message);
    }
}

// Run test
testFileUrl().then(() => console.log('Test completed'));
