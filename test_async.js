// Test script for async processing with call_id
const axios = require('axios');

const BASE_URL = 'http://localhost:5864';

async function testAsyncProcessing() {
    console.log('=== Testing Async Processing with call_id ===\n');
    
    const call_id = `test_${Date.now()}`;
    const dataNames = 'user_name,user_phone,user_email';
    
    console.log(`Using call_id: ${call_id}`);
    console.log(`Requesting data: ${dataNames}\n`);
    
    try {
        // Step 1: Initial request (should return accepted status immediately)
        console.log('Step 1: Making initial request...');
        const response1 = await axios.get(`${BASE_URL}/api/analysis`, {
            params: {
                dataNames: dataNames,
                call_id: call_id
            }
        });
        
        console.log('Initial response:', JSON.stringify(response1.data, null, 2));
        console.log('---\n');
        
        // Step 2: Check status multiple times until completed
        let attempts = 0;
        const maxAttempts = 20;
        
        while (attempts < maxAttempts) {
            attempts++;
            console.log(`Step 2.${attempts}: Checking status after 3 seconds...`);
            
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
            
            const response2 = await axios.get(`${BASE_URL}/api/analysis`, {
                params: {
                    dataNames: dataNames,
                    call_id: call_id
                }
            });
            
            console.log(`Status check ${attempts}:`, JSON.stringify(response2.data, null, 2));
            
            if (response2.data.analysis_response) {
                if (response2.data.analysis_response.status === 'processing') {
                    console.log('Still processing, will check again...\n');
                    continue;
                } else if (response2.data.analysis_response.required_data) {
                    console.log('✅ Processing completed! Final result received.');
                    break;
                }
            }
        }
        
        if (attempts >= maxAttempts) {
            console.log('❌ Max attempts reached, processing might be taking too long');
        }
        
    } catch (error) {
        console.error('Error during testing:', error.response?.data || error.message);
    }
}

async function testWithCustomValues() {
    console.log('\n\n=== Testing Async Processing with Custom Values ===\n');
    
    const call_id = `custom_test_${Date.now()}`;
    const dataNames = 'user_name,special_field,user_email';
    const customValues = {
        special_field: 'Custom async value!',
        user_name: 'אביב כהן'
    };
    
    console.log(`Using call_id: ${call_id}`);
    console.log(`Custom values:`, customValues);
    console.log(`Requesting data: ${dataNames}\n`);
    
    try {
        // Initial request with custom values
        console.log('Step 1: Making initial request with custom values...');
        const response1 = await axios.get(`${BASE_URL}/api/analysis`, {
            params: {
                dataNames: dataNames,
                call_id: call_id,
                customValues: encodeURIComponent(JSON.stringify(customValues))
            }
        });
        
        console.log('Initial response:', JSON.stringify(response1.data, null, 2));
        console.log('---\n');
        
        // Wait and check for result
        console.log('Step 2: Waiting 10 seconds then checking for result...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        const response2 = await axios.get(`${BASE_URL}/api/analysis`, {
            params: {
                dataNames: dataNames,
                call_id: call_id,
                customValues: encodeURIComponent(JSON.stringify(customValues))
            }
        });
        
        console.log('Final result:', JSON.stringify(response2.data, null, 2));
        
    } catch (error) {
        console.error('Error during custom values testing:', error.response?.data || error.message);
    }
}

// Run tests
async function runAllTests() {
    await testAsyncProcessing();
    await testWithCustomValues();
    console.log('\n=== All tests completed ===');
}

runAllTests();
