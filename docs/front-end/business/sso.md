# 单点登录（SSO）

## 概述

单点登录：Single Sign On，简称 SSO，用户只要登录一次，就可以访问所有相关信任应用的资源，企业里面用的会比较多，有很多内网平台，但是只要在一个系统登录就可以  
CAS 框架：CAS（Central Authentication Service）是实现 SSO 单点登录的框架

## CAS 实现单点登录的流程

1. 用户访问系统 A，判断未登录，则直接跳到认证中心页面
2. 在认证中心页面输入账号，密码，生成令牌，重定向到系统 A
3. 在系统 A 拿到令牌到认证中心去认证，认证通过，则建立对话
4. 用户访问系统 B，发现没有有效会话，则重定向到认证中心
5. 认证中心发现有全局会话，新建令牌，重定向到系统 B
6. 在系统 B 使用令牌去认证中心验证，验证成功后，建立系统 B 的局部会话

### 关键点

一、第一次访问系统 A

1. 用户访问系统 A（[www.appA.com](https://www.appA.com)）， 跳转认证中心 Client（[www.sso.com](https://www.sso.com)）， 然后输入用户名、密码登录，然后认证中心 serverSSO 把 `cookieSSO` 种在认证中心的域名下（[www.sso.com](https://www.sso.com)）， 重定向到系统 A，并且带上生成的 `ticket` 参数 ([www.appA.com?ticket=xxx](https://www.appA.com?ticket=xxx)）
2. 系统 A（[www.appA.com?ticket=xxx](https://www.appA.com?ticket=xxx)）请求系统 A 的后端 serverA ，serverA 去 serverSSO 验证，通过后，将 `cookieA` 种在 [www.appA.com](https://www.appA.com) 下

二、第二次访问系统 A 直接携带 `cookieA` 去访问后端，验证通过后，即登录成功

三、第三次访问系统 B

1. 访问系统 B（[www.appB.com](https://www.appB.com)），跳转到认证中心 Client（[www.sso.com](https://www.sso.com)）， 这个时候会把认证中心的 cookieSSO 也携带上，发现用户已登录过，则直接重定向到系统 B（[www.appB.com](https://www.appB.com)）， 并且带上生成的 `ticket` 参数（[www.appB.com?ticket=xxx](https://www.appB.com?ticket=xxx)）
2. 系统 B（[www.appB.com?ticket=xxx](https://www.appB.com?ticket=xxx)）请求系统 B 的后端 serverB，serverB 去 serverSSO 验证，通过后，将 `cookieB` 种在 [www.appB.com](https://www.appB.com) 下

## 参考地址

[单点登录（SSO） - 掘金](https://juejin.cn/post/7195588906809032764)
