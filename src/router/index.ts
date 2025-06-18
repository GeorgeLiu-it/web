import {createRouter, createWebHistory} from 'vue-router'
import {useUserStore} from "@/stores/user";
import {useLayoutStore} from "@/stores/layout";
import { KeepAlive } from 'vue';

const routes = [
    {
        path: '/',
        name: 'avaya',
        component: () => import('@/views/avaya/index.vue'),
        children: [
            {
                path: "",
                name: "index",
                component: () => import('@/views/avaya/index/index.vue'),
                meta: {
                    title: "Home"
                }
            },
            {
                path: "statistic",
                name: "statistic",
                component: () => import('@/views/avaya/statistic/index.vue'),
                meta: {
                    title: "Statistic"
                }
            },
            {
                path: "about",
                name: "about",
                component: () => import('@/views/avaya/about/index.vue'),
                meta: {
                    title: "About"
                }
            }
        ]
    },
    {
        path: '/rag',
        name: 'rag',
        component: () => import('@/views/rag/index.vue'),
        children: [
            {
                path: '/chat',
                name: 'Chat',
                meta: {
                    title: 'Chat',
                    icon: 'ChatDotRound',
                    KeepAlive: true
                },
                component: () => import('@/views/rag/chat/index.vue')
            },
            {
            path: '/documents',
            name: 'Documents',
            meta: {
                title: 'Documents',
                icon: 'FolderOpened'
            },
            component: () => import('@/views/rag/documents/index.vue')
            }
        ]
    },
    {
        path: '/confluence',
        name: 'confluence',
        component: () => import('@/views/confluence/index.vue'),
        children: [
            {
                path: "",
                name: "confluence-index",
                component: () => import('@/views/confluence/index/index.vue'),
                meta: {
                    title: "Home"
                }
            },
            {
                path: "search",
                name: "confluence-search",
                component: () => import('@/views/confluence/search/index.vue'),
                meta: {
                    title: "Search"
                }
            }
        ]
    },
    {
        path: "/article/:id",
        name: "article",
        component: () => import('@/views/confluence/article/index.vue')
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
            title: "Control Panel",
            requiresAuth: true
        },
        children: [
            {
                path: "",
                name: "home",
                component: () => import('@/views/dashboard/home/index.vue'),
                meta: {
                    title: "Home"
                },
            },
            {
                path: "user-center",
                name: "user-center",
                meta: {
                    title: "Self Center"
                },
                children: [
                    {
                        path: "user-info",
                        name: "user-info",
                        component: () => import('@/views/dashboard/user-center/user-info.vue'),
                        meta: {
                            title: "Information"
                        }

                    },
                    {
                        path: "user-star",
                        name: "user-star",
                        component: () => import('@/views/dashboard/user-center/user-star.vue'),
                        meta: {
                            title: "Like & Star"
                        }
                    },
                    {
                        path: "user-comment",
                        name: "user-comment",
                        component: () => import('@/views/dashboard/user-center/user-comment.vue'),
                        meta: {
                            title: "Comments"
                        }
                    },
                    {
                        path: "user-feedback",
                        name: "user-feedback",
                        component: () => import('@/views/dashboard/user-center/user-feedback.vue'),
                        meta: {
                            title: "Feedback"
                        }
                    }
                ]
            },
            {
                path: "users",
                name: "users",
                meta: {
                    title: "User Management",
                    requiresAdmin: true
                },
                children: [
                    {
                        path: "user-list",
                        name: "user-list",
                        component: () => import('@/views/dashboard/users/user-list.vue'),
                        meta: {
                            title: "User List"
                        }
                    }
                ]
            },
            {
                path: "articles",
                name: "articles",
                meta: {
                    title: "Article Management",
                    requiresAdmin: true
                },
                children: [
                    {
                        path: "article-publish",
                        name: "article-publish",
                        component: () => import('@/views/dashboard/articles/article-publish.vue'),
                        meta: {
                            title: "Publish"
                        }
                    },
                    {
                        path: "comment-list",
                        name: "comment-list",
                        component: () => import('@/views/dashboard/articles/comment-list.vue'),
                        meta: {
                            title: "Comments"
                        }
                    },
                    {
                        path: "article-list",
                        name: "article-list",
                        component: () => import('@/views/dashboard/articles/article-list.vue'),
                        meta: {
                            title: "List"
                        }
                    }
                ]
            },
            {
                path: "images",
                name: "images",
                meta: {
                    title: "Image Management",
                    requiresAdmin: true
                },
                children: [
                    {
                        path: "image-list",
                        name: "image-list",
                        component: () => import('@/views/dashboard/images/image-list.vue'),
                        meta: {
                            title: "List"
                        }
                    }
                ]
            },
            {
                path: "system",
                name: "system",
                meta: {
                    title: "System Management",
                    requiresAdmin: true
                },
                children: [
                    {
                        path: "feedback-list",
                        name: "feedback-list",
                        component: () => import('@/views/dashboard/system/feedback-list.vue'),
                        meta: {
                            title: "Feedback"
                        }
                    },
                    {
                        path: "login-logs",
                        name: "login-logs",
                        component: () => import('@/views/dashboard/system/login-logs.vue'),
                        meta: {
                            title: "Login Traces"
                        }
                    },
                    {
                        path: "app-config",
                        name: "app-config",
                        redirect: "/dashboard/system/app-config/site-config",
                        component: () => import('@/views/dashboard/system/app-config.vue'),
                        meta: {
                            title: "Configuration"
                        },
                        children: [
                            {
                                path: "site-config",
                                name: "site-config",
                                component: () => import('@/views/dashboard/system/config/site-config.vue'),
                                meta: {
                                    title: "Site"
                                }
                            },
                            {
                                path: "system-config",
                                name: "system-config",
                                component: () => import('@/views/dashboard/system/config/system-config.vue'),
                                meta: {
                                    title: "System"
                                }
                            },
                            {
                                path: "email-config",
                                name: "email-config",
                                component: () => import('@/views/dashboard/system/config/email-config.vue'),
                                meta: {
                                    title: "Email"
                                }
                            },
                            // {
                            //     path: "jwt-config",
                            //     name: "jwt-config",
                            //     component: () => import('@/views/dashboard/system/config/jwt-config.vue'),
                            //     meta: {
                            //         title: "jwt configuration"
                            //     }
                            // }
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: "/404",
        name: "404",
        component: () => import('@/views/error/index.vue')
    },
    {
        path: "/:catchAll(.*)",
        component: () => import('@/views/error/index.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
})

export default router

router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const layoutStore = useLayoutStore()
    userStore.initializeUserInfo().then(() => {
        const isAuthenticated = userStore.isLoggedIn // 检查用户是否登录的逻辑
        const isAdmin = userStore.isAdmin // 检查用户是否为管理员的逻辑
        if (to.matched.some(record => record.meta.requiresAuth)) {
            if (!isAuthenticated) {
                ElMessageBox.confirm(
                    'Login has expired!!!', 'Warning', {
                        cancelButtonText: 'Cancel',
                        confirmButtonText: 'Confirm',
                        type: 'warning',
                    })
                    .then(() => {
                        router.push({name: 'index', replace: true}).then(() => {
                            layoutStore.state.popoverVisible = true;
                            layoutStore.state.loginVisible = true;
                        });
                    })
                    .catch(() => {
                        router.push({name: from.name as string}).then();
                    });
            } else if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
                ElMessageBox.confirm(
                    'No enough privilege', 'Warning', {
                        confirmButtonText: 'Confirm',
                        type: 'warning',
                    })
                    .then(() => {
                        router.push({name: from.name as string}).then();
                    });
            } else {
                next(); // 继续访问
            }
        } else {
            next(); // 不需要登录，继续访问
        }
    })
});
