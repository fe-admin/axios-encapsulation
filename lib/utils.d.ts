import { PendingItem } from "../index.d";
import { AxiosRequestConfig } from "axios";
export declare function detectDuplicateRequests(request: PendingItem, config: AxiosRequestConfig): boolean;
