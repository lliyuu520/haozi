#!/bin/bash
APP_NAME=haozi-admin.jar
#初始化psid变量（全局）
psid=0

checkpid() {

   javaps=`$JAVA_HOME/bin/jps -l | grep $APP_NAME`

   if [ -n "$javaps" ]; then
      psid=`echo $javaps | awk '{print $1}'`
   else
      psid=0
   fi
}

#启动
start() {
   checkpid

   if [ $psid -ne 0 ]; then
      echo "================================"
      echo "warn: $APP_NAME already started! (pid=$psid)"
      echo "================================"
   else
      echo -n "Starting $APP_NAME ..."
      nohup java   -Djava.security.egd=file:/dev/./urandom -jar   $APP_NAME   >/dev/null 2>&1 &
      checkpid
      if [ $psid -ne 0 ]; then
         echo "(pid=$psid) [OK]"
      else
         echo "[Failed]"
      fi
   fi
}

#停止
stop() {
   checkpid

   if [ $psid -ne 0 ]; then
      echo -n "Stopping $APP_NAME ...(pid=$psid) "
      kill $psid
      if [ $? -eq 0 ]; then
         echo "[STOP ]${APP_NAME} SUCCESS"
      else
         echo "[STOP ]${APP_NAME} FAILED]"
      fi

      sleep 1  # 增加等待时间
      checkpid
      if [ $psid -ne 0 ]; then
         stop
      fi
   else
      echo "================================"
      echo "warn: $APP_NAME is not running"
      echo "================================"
   fi
}

#心跳
status() {
   checkpid

   if [ $psid -ne 0 ];  then
      echo "$APP_NAME is running! (pid=$psid)"
   else
      echo "$APP_NAME is not running"
   fi
}
#日志
log() {
   tail -200f /root/project/logs/haozi-admin/haozi-admin.log
}
#备份
backup() {
  mkdir -p bak
   cp $APP_NAME bak/
}

# 重命名
rename() {
   cp $APP_NAME.tmp $APP_NAME
}

# 依次执行 备份,停机,重命名,启动
restart() {
   backup
   stop
   rename
   start
}


#脚本
case "$1" in
   'start')
      start
      ;;
   'stop')
     stop
     ;;
   'restart')
     restart
     ;;
   'status')
     status
     ;;
     'log')
     log
     ;;
    'backup')
      backup
      ;;
    'rename')
      rename
      ;;

  *)
echo "Usage: $0 {|start|stop|restart|status|log|backup|rename}"
exit 1
esac
exit 0
