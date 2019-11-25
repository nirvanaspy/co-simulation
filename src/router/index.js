import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import MainPage from '../views/mainpage/Mainpage'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  // { path: '/projectManage', component: _import('projectManage/index'), hidden: true },
  { path: '/register', component: _import('register/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: MainPage,
    redirect: 'projectManage',
    hidden: true,
    meta: { allowBack: false },
    children: [{
      path: 'projectManage',
      component: _import('projectManage/index'),
      name: 'projectManage',
      meta: { title: 'projectManage', noCache: true }
    }]
  }
  /* {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  }*/
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [

  { path: '*', redirect: '/404', hidden: true },
  {
    path: '/mySublibrary/module',
    component: Layout,
    children: [{ path: '', component: _import('subLibrary/mySubLibrary'), name: 'moduleLib', meta: { title: '模型库', icon: '模型库' }}]
  },
  {
    path: '/mySublibrary/config',
    component: Layout,
    children: [{ path: '', component: _import('subLibrary/mySubLibrary'), name: 'configLib', meta: { title: '参数库', icon: '参数库' }}]
  },
  {
    path: '/mySublibrary/sim',
    component: Layout,
    children: [{ path: '', component: _import('subLibrary/mySubLibrary'), name: 'simLib', meta: { title: '仿真库', icon: '仿真库' }}]
  },
  {
    path: '/mySublibrary/knowledge',
    component: Layout,
    children: [{ path: '', component: _import('subLibrary/mySubLibrary'), name: 'knowledgeLib', meta: { title: '知识库', icon: '知识库' }}]
  },
  {
    path: '/projectManage',
    component: MainPage,
    children: [{ path: '', component: _import('projectManage/index'), name: 'project_manage', meta: { title: '项目管理', icon: 'user' }}],
    hidden: true
  },
  {
    path: '/myProject',
    component: MainPage,
    children: [{ path: '', component: _import('projectManage/myProject'), name: 'my_project_manage', meta: { title: '项目管理', icon: 'user' }}],
    hidden: true
  },
  {
    path: '/library',
    component: MainPage,
    children: [{ path: '', component: _import('library/index'), name: 'knowledge', meta: { title: '库管理', icon: 'user' }}],
    hidden: true
  },
  {
    path: '/sublibrary',
    component: MainPage,
    children: [{ path: 'sublibrary/:id', component: _import('subLibrary/index'), name: 'subLibrary', meta: { title: '子库管理', icon: 'user' }}],
    hidden: true
  },
  {
    path: '/sublibFiles',
    component: MainPage,
    children: [{ path: 'sublibFiles/:id', component: _import('subLibFiles/index'), name: 'subLibFiles', meta: { title: '子库文件管理', icon: 'user' }}],
    hidden: true
  },
  {
    path: '/audit_task',
    component: MainPage,
    children: [{ path: '', component: _import('auditTask/index'), name: 'auditTask', meta: { title: '我的审核', icon: 'audit' }}],
    hidden: true
  },
  {
    path: '/auditSubLibFiles',
    component: MainPage,
    children: [{ path: '', component: _import('subLibFileAudit/index'), name: 'subLibFileAudit', meta: { title: '我的审核', icon: 'audit' }}],
    hidden: true
  },
  { path: '/user_manage',
    component: Layout,
    children: [{ path: 'index', component: _import('user_manage/index'), name: 'user_manage', meta: { title: '用户管理', icon: 'user-icon' }}],
    meta: {
      roles: ['ROLE_ADMIN']
    }
  },
  { path: '/user_manage_guard',
    component: Layout,
    children: [{ path: 'index', component: _import('user_manage/security'), name: 'user_manage', meta: { title: '用户管理', icon: 'user-icon' }}],
    meta: {
      roles: ['ROLE_SECURITY_GUARD']
    }
  },
  {
    path: '/department',
    component: Layout,
    children: [{
      path: 'index',
      name: 'department',
      component: _import('department/index'),
      meta: {
        title: '部门管理',
        icon: 'department'
      }
    }],
    meta: {
      roles: ['ROLE_ADMIN', 'ROLE_SECURITY_GUARD']
    }
  },
  { path: '/task_manage',
    component: MainPage,
    children: [{ path: '', component: _import('tasks/index'), name: 'task_manage', meta: { title: '任务管理', icon: 'components1' }}],
    hidden: true
  },
  { path: '/visio',
    component: _import('visio/index-new'),
    name: 'visio',
    meta: { title: 'template', icon: 'components1' },
    hidden: true
  },
  {
    path: '/taskFiles',
    component: Layout,
    children: [{ path: 'taskFiles/:id', component: _import('taskFiles/index'), name: 'taskFiles', meta: { title: '当前任务', icon: 'documentation-icon' }}]
  },
  {
    path: '/device',
    component: Layout,
    hidden: true,
    children: [{ path: 'device/:id', component: _import('device/index'), name: 'device', meta: { title: 'device', icon: 'computer-icon' }}]
  },
  {
    path: '/audit_tasks',
    component: Layout,
    children: [{ path: 'index', component: _import('auditTask/index'), name: 'auditTasks', meta: { title: ' 任务审核', icon: 'audit2' }}]
  },
  {
    path: '/audit_subLibFile',
    component: Layout,
    children: [{ path: 'index', component: _import('subLibFileAudit/index'), name: 'subLibFileAudits', meta: { title: ' 文件审核', icon: 'audit2' }}]
  },
  {
    path: '/audit_apply',
    component: Layout,
    children: [{ path: 'index', component: _import('auditApply/index'), name: 'auditApply', meta: { title: '二次修改申请', icon: 'audit2' }}]
    /* meta: {
      roles: ['ROLE_ADMIN']
    }*/
  },
  {
    path: '/preview',
    component: _import('auditTask/preview'),
    // children: [{ path: 'index', component: _import('auditTask/preview'), name: 'preview', meta: { title: '申请', icon: 'audit' }}],
    hidden: true
  },
  // 下载日志
  {
    path: '/downloadLogs',
    component: Layout,
    children: [{ path: 'index', component: _import('log/index'), name: 'downloadLog', meta: { title: '下载日志', icon: 'logs' }}]
  }
]
