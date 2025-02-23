import { IconBrandBlogger, IconCategory2, IconHeart, IconHistory, IconHome2, IconImageInPicture, IconListLetters, IconSettings, IconTag, IconUserCheck } from '@tabler/icons-react';
import { IPost } from './type';
export default class Links {
    public static DASHBOARD = '/dashboard';
    public static ADMINS = '/admins';
    public static MEDIAS = '/medias';
    public static CONFIGS = '/configs';
    public static POSTS = '/posts';
    public static CATEGORIES = '/categories';
    public static TAGS = '/tags';
    public static LIKE = '/like';
    public static HISTORIES = '/histories';
    public static FEEDBACKS = '/feedbacks';
    public static SEARCH_HISTORIES = '/search-histories';
    public static HOME = '/';
    public static LOGIN = '/login';

    public static MENUS = [
        {
            path: this.DASHBOARD,
            title: 'Dashboard',
            icon: IconHome2,
        },
        {
            path: this.CONFIGS,
            title: 'Configs',
            icon: IconSettings,
        },
        {
            path: this.ADMINS,
            title: 'Admins',
            icon: IconUserCheck,
        },
        {
            path: this.MEDIAS,
            title: 'Medias',
            icon: IconImageInPicture,
        },
        {
            path: this.CATEGORIES,
            title: 'Categories',
            icon: IconCategory2,
        },
        {
            path: this.TAGS,
            title: 'Tags',
            icon: IconTag,
        },
        {
            path: this.POSTS,
            title: 'Posts',
            icon: IconBrandBlogger,
        },
        {
            path: this.SEARCH_HISTORIES,
            title: 'Search histories',
            icon: IconHistory,
        },
        {
            path: this.LIKE,
            title: 'Like',
            icon: IconHeart,
        },
        {
            path: this.HISTORIES,
            title: 'Histories',
            icon: IconHistory,
        },
        {
            path: this.FEEDBACKS,
            title: 'Feedbacks',
            icon: IconListLetters,
        },
    ];

    public static DETAIL_POST = (post: IPost) => {
        return this.POSTS + `/${post.id}`;
    };

    public static CREATE_POST = () => {
        return this.POSTS + `/create`;
    };
}
