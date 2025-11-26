import axios from 'axios';

// Helper to convert DDMMYYYY to YYYYMMDD
const formatDateForApi = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    const day = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4);
    const year = dateStr.substring(4, 8);
    return `${year}${month}${day}`;
};

export const getTrainStatus = async (trainNumber: string, journeyDate: string) => {
    const apiKey = process.env.INDIAN_RAIL_API_KEY;
    if (!apiKey || apiKey === 'your_indian_rail_api_key') {
        console.warn('Using mock data: API Key not configured');
        // Return mock data if no key
        return {
            trainNumber,
            journeyDate,
            trainName: 'Mock Express',
            currentStationCode: 'NDLS',
            currentStationName: 'New Delhi',
            delay: 0,
            position: 'At New Delhi (Mock)',
            route: []
        };
    }

    const formattedDate = formatDateForApi(journeyDate);
    const url = `http://indianrailapi.com/api/v2/livetrainstatus/apikey/${apiKey}/trainnumber/${trainNumber}/date/${formattedDate}/`;

    try {
        console.log(`Fetching real status for ${trainNumber} from ${url}`);
        const response = await axios.get(url);
        const data = response.data;

        console.log('Indian Rail API Response:', JSON.stringify(data, null, 2));

        // Map API response to our internal structure
        // Note: Adjust fields based on actual API response structure
        return {
            trainNumber,
            journeyDate,
            trainName: data.TrainName || `Train ${trainNumber}`,
            currentStationCode: data.CurrentStation?.StationCode || 'UNKNOWN',
            currentStationName: data.CurrentStation?.StationName || 'Unknown',
            delay: data.Delay || 0,
            position: data.Position || 'Unknown',
            route: data.TrainRoute || []
        };
    } catch (error) {
        console.error('Error fetching train status:', error);
        throw error;
    }
};
