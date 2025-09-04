# App Store API - Complete Request Examples

This document provides comprehensive examples of how to use the App Store API with various tools and programming languages.

## Prerequisites

1. Make sure the server is running on port 8081
2. Set your API key in the `.env` file
3. Include the API key in all requests using the `x-api-key` header

## cURL Examples

### 1. Get App Details
```bash
# Basic app details
curl -H "x-api-key: your_secret_api_key_here" \
     "http://localhost:8081/app/553834731"

# App details with ratings
curl -H "x-api-key: your_secret_api_key_here" \
     "http://localhost:8081/app/553834731?ratings=true"

# App details for different country
curl -H "x-api-key: your_secret_api_key_here" \
     "http://localhost:8081/app/553834731?country=cn&lang=zh"
```

### 2. Search Apps
```bash
# Basic search
curl -H "x-api-key: your_secret_api_key_here" \
     "http://localhost:8081/search?term=candy%20crush"

# Search with pagination and country
curl -H "x-api-key: your_secret_api_key_here" \
     "http://localhost:8081/search?term=puzzle%20game&num=20&page=1&country=us"
```

### 3. Get App Collections
```bash
# Top free apps
curl -H "x-api-key: your_secret_api_key_here" \
     "http://localhost:8081/list/topfreeapplications?num=10"

# Top free games
curl -H "x-api-key: your_secret_api_key_here" \
     "http://localhost:8081/list/topfreeapplications?category=6014&num=20"

# Top paid apps in specific country
curl -H "x-api-key: your_secret_api_key_here" \
     "http://localhost:8081/list/toppaidapplications?country=jp&num=15"
```

### 4. Get Developer Apps
```bash
# Get all apps by King (Candy Crush developer)
curl -H "x-api-key: your_secret_api_key_here" \
     "http://localhost:8081/developer/526656015"

# Get Facebook apps
curl -H "x-api-key: your_secret_api_key_here" \
     "http://localhost:8081/developer/284882218?country=us"
```

### 5. Get App Reviews
```bash
# Recent reviews
curl -H "x-api-key: your_secret_api_key_here" \
     "http://localhost:8081/reviews/553834731?sort=recent&page=1"

# Helpful reviews
curl -H "x-api-key: your_secret_api_key_here" \
     "http://localhost:8081/reviews/553834731?sort=helpful&page=1&country=us"
```

### 6. Get Similar Apps
```bash
curl -H "x-api-key: your_secret_api_key_here" \
     "http://localhost:8081/similar/553834731"
```

### 7. Get Privacy Details
```bash
curl -H "x-api-key: your_secret_api_key_here" \
     "http://localhost:8081/privacy/553834731"
```

### 8. Get Version History
```bash
curl -H "x-api-key: your_secret_api_key_here" \
     "http://localhost:8081/version-history/553834731"
```

## JavaScript/Node.js Examples

```javascript
const axios = require('axios');

class AppStoreAPI {
  constructor(apiKey, baseURL = 'http://localhost:8081') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.headers = {
      'x-api-key': apiKey,
      'Content-Type': 'application/json'
    };
  }

  async getApp(id, options = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/app/${id}`, {
        headers: this.headers,
        params: options
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get app: ${error.response?.data?.error || error.message}`);
    }
  }

  async searchApps(term, options = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/search`, {
        headers: this.headers,
        params: { term, ...options }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search apps: ${error.response?.data?.error || error.message}`);
    }
  }

  async getList(collection, options = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/list/${collection}`, {
        headers: this.headers,
        params: options
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get list: ${error.response?.data?.error || error.message}`);
    }
  }

  async getDeveloperApps(devId, options = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/developer/${devId}`, {
        headers: this.headers,
        params: options
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get developer apps: ${error.response?.data?.error || error.message}`);
    }
  }

  async getReviews(id, options = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/reviews/${id}`, {
        headers: this.headers,
        params: options
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get reviews: ${error.response?.data?.error || error.message}`);
    }
  }

  async getSimilar(id, options = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/similar/${id}`, {
        headers: this.headers,
        params: options
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get similar apps: ${error.response?.data?.error || error.message}`);
    }
  }

  async getPrivacy(id) {
    try {
      const response = await axios.get(`${this.baseURL}/privacy/${id}`, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get privacy: ${error.response?.data?.error || error.message}`);
    }
  }

  async getVersionHistory(id, options = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/version-history/${id}`, {
        headers: this.headers,
        params: options
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get version history: ${error.response?.data?.error || error.message}`);
    }
  }
}

// Usage examples
async function examples() {
  const api = new AppStoreAPI('your_secret_api_key_here');

  try {
    // Get Candy Crush Saga details
    const app = await api.getApp('553834731', { ratings: true });
    console.log('App:', app.title);

    // Search for puzzle games
    const searchResults = await api.searchApps('puzzle', { num: 5 });
    console.log('Search results:', searchResults.length);

    // Get top free games
    const topGames = await api.getList('topfreeapplications', { 
      category: 6014, 
      num: 10 
    });
    console.log('Top games:', topGames.length);

    // Get King's apps
    const kingApps = await api.getDeveloperApps('526656015');
    console.log('King apps:', kingApps.length);

    // Get reviews
    const reviews = await api.getReviews('553834731', { 
      sort: 'recent', 
      page: 1 
    });
    console.log('Reviews:', reviews.length);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run examples
examples();
```

## Python Examples

```python
import requests
from typing import Optional, Dict, Any

class AppStoreAPI:
    def __init__(self, api_key: str, base_url: str = 'http://localhost:8081'):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            'x-api-key': api_key,
            'Content-Type': 'application/json'
        }

    def _make_request(self, endpoint: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Make HTTP request to the API"""
        try:
            response = requests.get(
                f'{self.base_url}{endpoint}',
                headers=self.headers,
                params=params or {}
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f'API request failed: {e}')

    def get_app(self, app_id: str, **options) -> Dict[str, Any]:
        """Get app details"""
        return self._make_request(f'/app/{app_id}', options)

    def search_apps(self, term: str, **options) -> Dict[str, Any]:
        """Search for apps"""
        params = {'term': term, **options}
        return self._make_request('/search', params)

    def get_list(self, collection: str, **options) -> Dict[str, Any]:
        """Get app collection"""
        return self._make_request(f'/list/{collection}', options)

    def get_developer_apps(self, dev_id: str, **options) -> Dict[str, Any]:
        """Get apps by developer"""
        return self._make_request(f'/developer/{dev_id}', options)

    def get_reviews(self, app_id: str, **options) -> Dict[str, Any]:
        """Get app reviews"""
        return self._make_request(f'/reviews/{app_id}', options)

    def get_similar(self, app_id: str, **options) -> Dict[str, Any]:
        """Get similar apps"""
        return self._make_request(f'/similar/{app_id}', options)

    def get_privacy(self, app_id: str) -> Dict[str, Any]:
        """Get app privacy details"""
        return self._make_request(f'/privacy/{app_id}')

    def get_version_history(self, app_id: str, **options) -> Dict[str, Any]:
        """Get app version history"""
        return self._make_request(f'/version-history/{app_id}', options)

# Usage examples
def main():
    api = AppStoreAPI('your_secret_api_key_here')
    
    try:
        # Get app details
        app = api.get_app('553834731', ratings=True)
        print(f"App: {app['title']}")
        
        # Search apps
        results = api.search_apps('puzzle', num=5)
        print(f"Search results: {len(results)}")
        
        # Get top free games
        games = api.get_list('topfreeapplications', category=6014, num=10)
        print(f"Top games: {len(games)}")
        
        # Get developer apps
        king_apps = api.get_developer_apps('526656015')
        print(f"King apps: {len(king_apps)}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    main()
```

## Common Parameters

### Country Codes
- `us` - United States
- `cn` - China
- `jp` - Japan
- `gb` - United Kingdom
- `de` - Germany
- `fr` - France
- `kr` - South Korea

### Language Codes
- `en` - English
- `zh` - Chinese
- `ja` - Japanese
- `ko` - Korean
- `de` - German
- `fr` - French

### Category IDs
- `6014` - Games
- `6016` - Entertainment
- `6017` - Education
- `6018` - Photo & Video
- `6020` - Medical
- `6021` - Music
- `6022` - Productivity
- `6023` - Business

### Collection Types
- `topfreeapplications` - Top Free Apps
- `toppaidapplications` - Top Paid Apps
- `topgrossingapplications` - Top Grossing Apps
- `newfreeapplications` - New Free Apps
- `newpaidapplications` - New Paid Apps

## Error Handling

Always handle these common error scenarios:

1. **401 Unauthorized** - Invalid or missing API key
2. **404 Not Found** - App, developer, or resource not found
3. **500 Internal Server Error** - Server-side issues
4. **Network errors** - Connection timeouts, DNS issues

Example error handling in JavaScript:
```javascript
try {
  const app = await api.getApp('invalid_id');
} catch (error) {
  if (error.message.includes('404')) {
    console.log('App not found');
  } else if (error.message.includes('401')) {
    console.log('Invalid API key');
  } else {
    console.log('Other error:', error.message);
  }
}
```
