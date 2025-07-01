// import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

export class ApiService {
  private static baseURL = 'http://localhost:3000/api';
  // private static instance: AxiosInstance;

  // static {
  //   this.instance = axios.create({
  //     baseURL: this.baseURL,
  //     timeout: 10000,
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });

  //   // Request interceptor
  //   this.instance.interceptors.request.use(
  //     (config) => {
  //       console.log('API Request:', config);
  //       return config;
  //     },
  //     (error) => {
  //       console.error('API Request Error:', error);
  //       return Promise.reject(error);
  //     }
  //   );

  //   // Response interceptor
  //   this.instance.interceptors.response.use(
  //     (response) => {
  //       console.log('API Response:', response);
  //       return response;
  //     },
  //     (error) => {
  //       console.error('API Response Error:', error);
  //       return Promise.reject(error);
  //     }
  //   );
  // }

  static async get<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      // return await this.instance.get(url, config);
      
      // Mock response for development
      console.log('GET request to:', url);
      return {
        data: {} as T,
        status: 200,
        statusText: 'OK'
      };
    } catch (error) {
      console.error('GET request error:', error);
      throw error;
    }
  }

  static async post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      // return await this.instance.post(url, data, config);
      
      // Mock response for development
      console.log('POST request to:', url, 'with data:', data);
      return {
        data: {} as T,
        status: 200,
        statusText: 'OK'
      };
    } catch (error) {
      console.error('POST request error:', error);
      throw error;
    }
  }

  static async put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      // return await this.instance.put(url, data, config);
      
      // Mock response for development
      console.log('PUT request to:', url, 'with data:', data);
      return {
        data: {} as T,
        status: 200,
        statusText: 'OK'
      };
    } catch (error) {
      console.error('PUT request error:', error);
      throw error;
    }
  }

  static async delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      // return await this.instance.delete(url, config);
      
      // Mock response for development
      console.log('DELETE request to:', url);
      return {
        data: {} as T,
        status: 200,
        statusText: 'OK'
      };
    } catch (error) {
      console.error('DELETE request error:', error);
      throw error;
    }
  }

  static setBaseURL(url: string): void {
    this.baseURL = url;
    // if (this.instance) {
    //   this.instance.defaults.baseURL = url;
    // }
  }

  static setAuthToken(token: string): void {
    // if (this.instance) {
    //   this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // }
    console.log('Setting auth token:', token);
  }

  static removeAuthToken(): void {
    // if (this.instance) {
    //   delete this.instance.defaults.headers.common['Authorization'];
    // }
    console.log('Removing auth token');
  }
}