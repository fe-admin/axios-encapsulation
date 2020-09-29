# axios-encapsulation
axios encapsulation
## 1.0.1
修改 setResponseInterceptors  添加 responseChain 

# axios-encapsulation

Axios plugin that intercepts failed requests and retries them whenever possible.

## Installation

```bash
npm install axios-encapsulation
```

### Note


## Usage

```js
import encapsulation from 'axios-encapsulation';

const transformData = function (res) {
  if (res.data.code === 200) {
    return res.data.data;
  } else {
    return Promise.reject(res.data);
  }
}
const encapsulationInstance = new encapsulation({
  axiosRetryConfig: {
    retryDelay: (retryCount) => {
      return retryCount * 1000;
    },
    shouldResetTimeout: true,
    retryCondition: (error) => {
      return (error.config.method === 'get' || error.config.method === 'post');
    }
  },
  responseChain: [transformData],
})

const { axiosInstance } = encapsulationInstance;

axiosInstance.get('http://example.com/test')
  .then(result => {
    result.data;
  });

```