/**
 * config
 */

var path = require('path');

var config = {
  // for local test if setting debug equals true
  debug: true,

  get mini_assets() { return !this.debug; }, // 是否启用静态文件的合并压缩，详见视图中的Loader

  name: 'site names', // site name
  description: 'your description of your site', // site description
  keywords: 'nodejs, node, express, connect, socket.io',

  // information added to html head
  site_headers: [
    '<meta name="author" content="EDP@TAOBAO" />'
  ],
  site_logo: '/public/images/cnodejs_light.svg', // default is `name`
  site_icon: '/public/img/node_icon_32.png', // 默认没有 favicon, 这里填写网址
  // nav on the top right
  site_navs: [
    // format [ path, title, [target=''] ]
    [ '/about', '关于' ]
  ],
  // cdn host，for example http://nodeBoilerplate.qiniudn.com
  site_static_host: '', // storage domain for static files
  // domain of the site
  host: 'http://localhost',

  uploadDir: {
    development:'/Users/frank25184/desktop/nodejs/nodeForm-team/public/upload/',
    production: '/var/www/trver.com/public_html/public/upload/',
  },
  google_tracker_id: '',
  // default cnzz tracker ID，please fix if owned by yourself
  cnzz_tracker_id: '',

  // mongodb setting
  db: {
       mongo:{
          development: {
            'url':'mongodb://localhost/db_name',
          },
          production:{
             'url': ''
          },
       },
       redis:{
        //redis config, default to the localhost
          development: {
            'host':'127.0.0.1',
            'port':'6379',
            'db':'0',
            'pw':'your passport',
            'ttl':200,
          },
          production:{
             'url': '',
             'url': '',
             'url': '',
             'url': '',
          },
       },          
  }, 

  session_secret: 'node_site_secret', //change according to your needs
  auth_cookie_name: 'node_site',

  // port of the running app
  port: 8000,

  // topic number of the topic list shown
  list_topic_count: 20,

  // RSS setting
  rss: {
    title: 'site title',
    link: 'http://yourapp.com',
    language: 'zh-cn',
    description: 'site：one world description',
    // the largest number of obtaining RSS Item
    max_rss_items: 50
  },

  //Email setting
  mail_opts: {
    host: 'smtp.mxhichina.com',
    port: 465,
    secure: true,
    auth: {
      user: 'your user',
      pass: 'your password'
    },
  },

  //weibo app key
  weibo_key: 10000000,
  weibo_id: 'your_weibo_id',

  // admin can delete and change topic。change user_login_name to your username
  admins: { frank25184: true },

  // // github 
  // GITHUB_OAUTH: {
  //   clientID: 'your GITHUB_CLIENT_ID',
  //   clientSecret: 'your GITHUB_CLIENT_SECRET',
  //   callbackURL: 'http://yoursite.com/auth/github/callback'
  // },

  // if loging in directly is permitted（or only using github）
  allow_sign_up: true,

  // oneapm is a service provided for watching the performance of the site
  oneapm_key: '',

  // the following two are all file uploading setting 

  // 7牛's access setting
  qn_access: {
    accessKey: 'your access key',
    secretKey: 'your secret key',
    bucket: 'your bucket name',
    origin: 'http://your qiniu domain',
    // if using vps，please use http://up.qiniug.com/ ，which is the international node in 7 牛
    // stay empty if in china
    uploadURL: 'http://xxxxxxxx',
  },

  // if qn_access，it will upload to 7牛 so that it does not work for the following setting
  upload: {
    path: path.join(__dirname, 'public/upload/'),
    url: '/public/upload/'
  },

  file_limit: '1MB',

  // forum blocks
  tabs: [
    ['share', ''],
    ['ask', ''],
    ['job', ''],
  ],

  // 极光推送
  jpush: {
    appKey: 'YourAccessKeyyyyyyyyyyyy',
    masterSecret: 'YourSecretKeyyyyyyyyyyyyy',
    isDebug: false,
  },

  create_post_per_day: 1000, // 每个用户一天可以发的主题数
  create_reply_per_day: 1000, // 每个用户一天可以发的评论数
  visit_per_day: 1000, // 每个 ip 每天能访问的次数
};

if (process.env.NODE_ENV === 'test') {
  config.db = 'mongodb://127.0.0.1/db_name_test';
}

module.exports = config;
