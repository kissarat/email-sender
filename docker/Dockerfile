FROM ubuntu:20.04

COPY ./install.sh .

RUN bash install.sh

ENV NODE_ENV=development

RUN cd /root/server 

EXPOSE 3000

ENTRYPOINT ["/bin/bash", "/root/server/docker/entrypoint.sh"]
