# Github

## Github 配置 SSH key

（1）检查本地主机是否已经存在 ssh key

```bash
cd ~/.ssh
ls
```

查看是否已有 id_rsa.pub 和 id_dsa.pub 文件，如果存在，说明已经有 ssh key，直接跳到第三步

（2）生成 ssh key

```bash
ssh-keygen -t rsa -C "zhangsan@qq.com"
```

（3）添加你的 SSH key 到 github 上面去
