#!/usr/bin/env bash

# 值守进程脚本，

deploy_dir=$(cd `dirname $0`/..; pwd)
jar_file=$(find ${deploy_dir} -name "*.jar")
script_dir=$(cd `dirname $0`; pwd)
log_dir=${deploy_dir}/log

start_times=0

function clear_daemon_log() {
    log_file=${log_dir}/daemon.log
    log_size=$(wc -l < ${log_file})

    if [[ ${log_size} -ge 10000 ]]
    then
        echo log_size is too large: ${log_size}
        echo "refresh log" > ${log_file}
    fi
}

echo $$ > ${script_dir}/daemon_pid

while true
do
    pid=`ps ax | grep ${jar_file} | grep java | awk '{print $1}'`

    if [[ -z ${pid} ]]    #如果为空,表示进程未启动
    then
        let "start_times++"
        echo $(date) - start_times: ${start_times}

        bash ${script_dir}/start.sh
        echo $(date) - restart ok !
    else
        echo $(date) - service is running, pid: ${pid}
    fi

    sleep 5

    clear_daemon_log
done
