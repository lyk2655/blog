#!/usr/bin/env bash

deploy_dir=$(cd `dirname $0`/..; pwd)
script_dir=$(cd `dirname $0`; pwd)

read daemon_pid < ${script_dir}/daemon_pid

echo daemon_pid: ${daemon_pid}

if [[ -n ${daemon_pid} ]]
then
    kill ${daemon_pid}
    echo daemon process is stopped!
else
    echo daemon process already stopped!
fi

bash ${script_dir}/stop.sh
