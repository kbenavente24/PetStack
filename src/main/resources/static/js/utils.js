export async function apiCall(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchOptions = { ...options, headers };

    try {
        const response = await fetch(endpoint, fetchOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

export function formatTime12Hour(isoTimestamp) {
    const date = new Date(isoTimestamp);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

export function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getDayRange(date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return {
        start: start.toISOString(),
        end: end.toISOString()
    };
}

export function getOrdinalSuffix(date) {
    if(date === 1 || date === 21 || date === 31){
        return date + 'st';
    } else if(date === 2 || date === 22){
        return date + 'nd';
    } else if (date === 3 || date === 23){
        return date + 'rd';
    } else {
        return date + 'th';
    }
}

export function getActivityIcon(activityType) {
    const iconMap = {
        'FED': { type: 'image', value: 'images/food-icon.png' },
        'WALKED': { type: 'image', value: 'images/walk-icon.png' },
        'PEE': { type: 'image', value: 'images/pee-icon.png' },
        'POOP': { type: 'image', value: 'images/poop-icon.png' }
    };

    const iconData = iconMap[activityType] || { type: 'emoji', value: '❓' };

    if (iconData.type === 'image') {
        const img = document.createElement('img');
        img.src = iconData.value;
        img.alt = activityType;
        img.className = 'activity-entry-icon';
        return img;
    } else {
        const span = document.createElement('span');
        span.textContent = iconData.value;
        span.className = 'activity-entry-icon';
        return span;
    }
}
