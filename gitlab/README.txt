once the pod started you must login into the pod and change the root password with this command:

gitlab-rake "gitlab:password:reset[root]"

on docker-compose.yml the line "restart: always" is commented due this container need at least 4 GB of ram, if you are under production environment feel free to uncomment thar line
