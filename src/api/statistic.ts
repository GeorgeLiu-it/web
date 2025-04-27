import type {ApiResponse} from "@/utils/request";
import service from "@/utils/request";

export interface statistic {
    created_at: string;
    updated_at: string;

    eid: string;
    sr_number: string;
    severity: string;
    status: string;
    type: string;
    customer_segment: string;
}

export const prioritizeList = (): Promise<ApiResponse<statistic[]>> => {
    return service({
        url: '/prioritize/list',
        method: 'get',
    });
}