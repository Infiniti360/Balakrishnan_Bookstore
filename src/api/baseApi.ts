import { APIRequestContext, expect } from '@playwright/test';
import { test } from '@playwright/test';

export class BaseApi {
    public request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    protected async validateResponse(response: any, expectedStatus: number) {
        expect(response.status()).toBe(expectedStatus);
        return response;
    }

    protected async getResponseData(response: any) {
        return response.json();
    }

    protected async handleError(error: any) {
        console.error('API Error:', error);
        throw error;
    }
} 