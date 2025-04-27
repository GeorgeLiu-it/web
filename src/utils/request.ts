import axios from "axios";
import type {AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig} from "axios";
import {useUserStore} from '@/stores/user';
import router from '@/router/index';
import {useLayoutStore} from "@/stores/layout";

const service = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    timeout: 10000,
})

export interface ApiResponse<T> {
    code: number;
    msg: string;
    data: T;
}

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const userStore = useUserStore();
        config.headers = {
            'Content-Type': 'application/json',
            'x-access-token': userStore.state.accessToken,
            ...config.headers,
        }
        return config as InternalAxiosRequestConfig
    },
    (error: AxiosError) => {
        ElMessage.error({
            showClose: true,
            message: error.message,
            type: 'error',
        })
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    (response: AxiosResponse) => {
        const userStore = useUserStore()
        if (response.headers['new-access-token']) {
            userStore.state.accessToken = (response.headers['new-access-token'])
        }
        if (response.data.code !== 0) {
            ElMessage.error(response.data.msg)

            if (response.data.data && response.data.data.reload) {
                userStore.reset()
                const layoutStore = useLayoutStore()
                localStorage.clear()
                router.push({name: 'index', replace: true}).then(() => {
                    layoutStore.state.popoverVisible = true
                    layoutStore.state.loginVisible = true
                })
            }
        }
        return response.data
    },
    (error: AxiosError) => {
        if (!error.response) {
            ElMessageBox.confirm(`
        <p>Detect request error</p>
        <p>${error.message}</p>
      `, 'Request error', {
                dangerouslyUseHTMLString: true,
                distinguishCancelAndClose: true,
                confirmButtonText: 'Try again later',
                cancelButtonText: 'Cancel',
            }).then()
            return Promise.reject(error)
        }

        switch (error.response.status) {
            case 500:
                return handleSpecificError(500, error)
            case 404:
                return handleSpecificError(404, error)
            case 403:
                return handleSpecificError(403, error)
        }
        return Promise.reject(error)
    }
);

// 处理具体错误状态
const handleSpecificError = (status: number, error: AxiosError) => {
    const errorMessages: { [key: number]: string } = {
        500: `
            <p>API Error: ${error.message}</p>
            <p>Error Code: <span style="color:red">500</span></p>
            <p>Backend error</p>
            <p>Please clear the browser cache and login again</p>
        `,
        404: `
            <p>API Error: ${error.message}</p>
            <p>Error Code: <span style="color:red">404</span></p>
            <p>The page does not exist</p>
            <p>Please check your API.</p>
        `,
        403: `
            <p>Permission Error: ${error.message}</p>
            <p>Error Code: <span style="color:red">403</span></p>
            <p>Check your permission。</p>
            <p>Please contact with administrator</p>
        `,
    }

    ElMessageBox.confirm(errorMessages[status], 'API error', {
        dangerouslyUseHTMLString: true,
        distinguishCancelAndClose: true,
        confirmButtonText: 'Clear cache',
        cancelButtonText: 'Cancel',
    }).then(() => {
        const userStore = useUserStore()
        userStore.reset()
        const layoutStore = useLayoutStore()
        localStorage.clear()
        router.push({name: 'index', replace: true}).then(() => {
            layoutStore.state.popoverVisible = true
            layoutStore.state.loginVisible = true
        });
    });

    return Promise.reject(error)
};

export default service
