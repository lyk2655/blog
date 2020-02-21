#!/usr/bin/env bash

deploy_dir=$(cd `dirname $0`/..; pwd)
echo "deploy_dir": ${deploy_dir}
jar_file=$(find ${deploy_dir} -name "*.jar")
echo "jar_file": ${jar_file}

pid=`ps ax | grep ${jar_file} | grep java | awk '{print $1}'`
echo "pid": ${pid}

function waitForTerm() {
    pid=$1
    seconds=$2

    for sec in $(seq 1 ${seconds}); do
        if ps -p "${pid}" 2>&1 > /dev/null; then
            if [[ ${sec} -lt 15 ]]; then
                echo "Waiting for server shut down [${sec}s/${seconds}s]"
                sleep 1
                continue
            fi
        else
            echo "Server is shut down!";
            exit 0
        fi
    done
}

if [[ -z ${pid} ]]
then
    echo "Server(pid:${pid}) is not running"
    exit 0
else
    echo ${pid} | xargs kill -SIGTERM

    waitForTerm ${pid} 15

    echo "Server shutdown timeout, process ${pid} will be killed forcibly"
    kill -9 ${pid}; sleep 1; break;
fi

