const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    PRODUCTS_CATEGORY: ':category',
    OUR_SERVICES : 'services',
    BLOGS: 'blogs',
    FAQ: 'contact',
    DETAIL_PRODUCT__CATEGORY__PID__TITLE: ':category/:pid/:title',
    DETAIL_SERVICE__CATEGORY__SID__TITLE: "services/:sid/:title",
    DETAIL_BLOGS__CATEGORY__SID__TITLE: "blogs/:bid/:title",
    RESET_PASSWORD:'reset-password/:token',
    CART : 'cart',
    DETAIL_CART : 'detail-cart',
    CHECK_OUT : 'check-out',
    PRODUCTS : 'products',
    WISHLIST: 'whistlist',
    OUR_TEAM : 'ourteam',
    

    //Admin
    ADMIN : 'admin',
    // DASHBOARD: 'dashboard',
    MANAGE_USER: 'manage-user',
    MANAGE_SUPERVISE: 'manage-supervise',
    MANAGE_PRODUCTS: 'manage-products',
    MANAGE_ORDER: 'manage-order',
    MANAGE_BOOKING: 'manage-booking',
    CREATE_PRODUCTS: 'create-products',
    CREATE_SUPERVISE: 'create-supervise',
    MANAGE_BLOGS: 'manage-blogs',
    CREATE_BLOGS: 'create-blogs',
    MANAGE_SERVICES: 'manage-services',
    CREATE_SERVICES: 'create-services',
    OVER_VIEW: 'over-view',
    PROFILE_ADMIN: 'profile-admin',

    // Member
    MEMBER: 'member',
    PERSONAL: 'personal',
    MY_CART: 'my-cart',
    HISTORY: 'buy-history',
    
}
export default path
