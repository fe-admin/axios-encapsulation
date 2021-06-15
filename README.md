# axios-encapsulation

Axios plugin that intercepts failed requests and retries them whenever possible.

## Installation

```bash
npm install axios-encapsulation
```

## Usage

```js
import Encapsulation from "axios-encapsulation";
import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios/index.d";

const transformData = function (res: AxiosResponse) {
  if (res.data.code === 200) {
    return res.data.data !== undefined ? res.data.data : res.data.result;
  }
  return Promise.reject(res.data);
};

const addStampToken = function (config: AxiosRequestConfig) {
  const token = getToken();
  if (token) {
    set(config, "headers.common", { token });
  }
  if (config.method === "get") {
    config.params = {
      ...config.params,
      stamp: Math.random(),
    };
  }
  return config;
};

const encapsulationInstance = new Encapsulation({
  retry: {
    retryDelay: (retryCount: number) => {
      return retryCount * 1000;
    },
    shouldResetTimeout: true,
    retryCondition: (error: AxiosError) => {
      return error.config.method === "get" || error.config.method === "post";
    },
  },
  request: [addStampToken],
  response: [transformData],
});
const { Axios } = encapsulationInstance;
const { get, post } = Axios;
```
