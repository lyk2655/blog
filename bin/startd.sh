#!/usr/bin/env bash


deploy_dir=$(cd `dirname $0`/..; pwd)
script_dir=$(cd `dirname $0`; pwd)
log_dir=${deploy_dir}/log

mkdir -p ${log_dir}

bash ${script_dir}/daemon.sh > ${log_dir}/daemon.log 2>&1 &

tail -f /home/linyk3/workspace/blog/log/blog-dev.log
