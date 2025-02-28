import axios from "axios";

const API_BASE = "http://localhost:5000"; // Your backend URL
const NUM_REQUESTS = 10000; // Number of concurrent signup requests
const DELAY_BETWEEN_BATCHES = 1000; // Delay between batches in ms
const BATCH_SIZE = 10000; // Number of requests per batch

// Utility function to generate random user data
function generateUserData(index) {
    return {
        fullname: {
            firstname: `TestUser${index}`,
            lastname: `LoadTest${Math.floor(Math.random() * 1000)}`
        },
        email: `testuser${index}_${Date.now()}@loadtest.com`,
        password: "Test@123456"
    };
}

// Function to make a single signup request
async function makeSignupRequest(userData, index) {
    const startTime = Date.now();
    try {
        const response = await axios.post(`${API_BASE}/users/register`, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const endTime = Date.now();
        return {
            success: true,
            time: endTime - startTime,
            status: response.status,
            userId: response.data?.user?._id,
            index
        };
    } catch (error) {
        return {
            success: false,
            time: Date.now() - startTime,
            error: error.response?.data?.message || error.message,
            status: error.response?.status,
            index
        };
    }
}

// Function to process requests in batches
async function processBatch(startIndex, batchSize) {
    const batchRequests = [];
    for (let i = 0; i < batchSize; i++) {
        const index = startIndex + i;
        const userData = generateUserData(index);
        batchRequests.push(makeSignupRequest(userData, index));
    }
    return Promise.all(batchRequests);
}

// Main load test function
async function runLoadTest() {
    console.log('\n🚀 Starting Load Test');
    console.log(`📊 Total Requests: ${NUM_REQUESTS}`);
    console.log(`📦 Batch Size: ${BATCH_SIZE}`);
    console.log(`⏱️  Delay Between Batches: ${DELAY_BETWEEN_BATCHES}ms\n`);

    const allResults = [];
    const startTime = Date.now();

    // Process requests in batches
    for (let i = 0; i < NUM_REQUESTS; i += BATCH_SIZE) {
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        const currentBatchSize = Math.min(BATCH_SIZE, NUM_REQUESTS - i);
        
        console.log(`\n📦 Processing Batch ${batchNumber}...`);
        const batchResults = await processBatch(i, currentBatchSize);
        allResults.push(...batchResults);

        // Print batch results
        const batchSuccesses = batchResults.filter(r => r.success).length;
        console.log(`✅ Batch ${batchNumber} Complete: ${batchSuccesses}/${currentBatchSize} successful`);

        // Delay before next batch (except for last batch)
        if (i + BATCH_SIZE < NUM_REQUESTS) {
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
    }

    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000; // Convert to seconds

    // Calculate statistics
    const successful = allResults.filter(r => r.success);
    const failed = allResults.filter(r => !r.success);
    const avgResponseTime = successful.reduce((sum, r) => sum + r.time, 0) / successful.length;
    const maxResponseTime = Math.max(...allResults.map(r => r.time));
    const minResponseTime = Math.min(...allResults.map(r => r.time));

    // Print final results
    console.log('\n📊 Load Test Results:');
    console.log('===================');
    console.log(`✅ Successful Requests: ${successful.length}`);
    console.log(`❌ Failed Requests: ${failed.length}`);
    console.log(`⏱️  Total Time: ${totalTime.toFixed(2)} seconds`);
    console.log(`📈 Requests per Second: ${(NUM_REQUESTS / totalTime).toFixed(2)}`);
    console.log(`⚡ Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`⬆️  Max Response Time: ${maxResponseTime}ms`);
    console.log(`⬇️  Min Response Time: ${minResponseTime}ms`);

    // Print error summary if there were failures
    if (failed.length > 0) {
        console.log('\n❌ Error Summary:');
        const errorCounts = failed.reduce((acc, curr) => {
            const error = curr.error || 'Unknown error';
            acc[error] = (acc[error] || 0) + 1;
            return acc;
        }, {});
        
        Object.entries(errorCounts).forEach(([error, count]) => {
            console.log(`   ${count}x: ${error}`);
        });
    }
}

// Run the load test
runLoadTest()
    .then(() => console.log('\n✨ Load test complete'))
    .catch(error => console.error('\n💥 Load test failed:', error))
    .finally(() => process.exit());
