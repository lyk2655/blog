#!/bin/sh

active_profile=dev
xmx_size=1g
xms_size=1g
#转为小写
active_profile=${active_profile,,}
xmx_size=${xmx_size,,}
xms_size=${xms_size,,}

deploy_dir=$(cd `dirname $0`/..; pwd)
#log_dir=${deploy_dir}/log
log_dir=/home/linyk3/workspace/blog/log
config_dir=${deploy_dir}/conf

if [[ ! -d "$log_dir" ]];then
   mkdir -p "$log_dir"
fi

jar_file=$(find ${deploy_dir} -name "*.jar")
out_file=/dev/null
spring_config_files=${config_dir}/application.yml,${config_dir}/application-${active_profile}.yml

echo "jar_file:" ${jar_file}
echo "log_dir:" ${log_dir}
echo "config_dir:" ${config_dir}
echo "spring_config_files:" ${spring_config_files}

cd ${deploy_dir}

nohup java \
    -Xmx${xmx_size} \
    -Xms${xms_size} \
    -DlogDir=${log_dir} \
    -jar ${jar_file} \
    --spring.config.location=${spring_config_files} \
    --spring.profiles.active=${active_profile} \
    --logging.config=${config_dir}/logback-spring.xml \
    > "${out_file}" 2>&1 &

echo "blog-app server started!"
