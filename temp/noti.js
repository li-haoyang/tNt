function noti_permit(){
    if (window.Notification && Notification.permission !== "granted") {
        Notification.requestPermission(function (status) {
      if (Notification.permission !== status) {
        Notification.permission = status;
      }
      if (status === "granted") {
        var noti_permit_success= new Notification("通知开启成功！",{icon:"https://migu.plus/t/pic/fll.png",tag: 'noti_permit_success'});
        noti_permit_success.onclick = function(event) {
    event.preventDefault(); 
    window.open('http://course2020.whu.edu.cn/pc/course/studentClassRoom', '_blank');
  }
      }else{
        noti_permit_fail_jbox= new jBox('Modal', {
    height: 300,
    width:500,
    title: '没有获得通知权限',
    content: "<h4>授权方法</h4><img src='https://migu.plus/t/pic/noti_help1.png';height=50px;width=50px;/><p>如果授权后仍旧没有通知，请确认windows的专注模式是否开启，开启状态下所有通知都会静音且收纳到通知中心内。</p>",
    onCloseComplete: function () {
         this.destroy();
      }
  });
  noti_permit_fail_jbox.open();
      }

    });}else{
        var noti_permit_success= new Notification("通知已打开！",{icon:"https://migu.plus/t/pic/bzicon.jpg",tag: 'noti_permit_done'});
    };
}
function noti_course(){
    var myDate = new Date;
    var h=myDate.getHours();
    var m=myDate.getMinutes();
    var current_m=h*60+m;
    for(var i=1;i<=13;i++){
        if(current_m==dic_course_startmin[i]){
            if (window.Notification && Notification.permission== "granted"){
            var noti_course_start= new Notification("开始上第"+i+"节课啦",{icon:"https://migu.plus/t/pic/icon_course_start.jpg",tag: 'noti_course_start'});
            }else{
jbox_notice_1("第"+i+"节课开始上课咯~",2,"left","fancy");
            }
        }else if(current_m==dic_course_startmin[i]+45){
            if (window.Notification && Notification.permission== "granted"){
                var noti_course_finish= new Notification("第"+i+"节课已结束，休息一下吧",{icon:"https://migu.plus/t/pic/noti_course_finish.jpg",tag: 'noti_course_finish'});
                }else{
    jbox_notice_1("第"+i+"节课结束了~",3,"left","fancy");
                }
        }
    }
}
function course_near_noti(){
    course_data.forEach(course => {
        if(course['daily_avali']==1){
              if(current_minute==dic_course_startmin['course_start']-5){
                var course_near_noti= new Notification(course['course_name']+"还有五分钟就要上课啦",{body:"查看课程表",icon:"https://migu.plus/t/pic/course_near_noti.jpg",tag: 'course_near_noti'});
              }else if(current_minute==dic_course_startmin['course_start']){
                var course_begin_noti= new Notification(course['course_name']+"已经开始啦",{body:"前往课室签到",icon:"https://migu.plus/t/pic/course_near_noti.jpg",tag: 'course_near_noti'});
                course_begin_noti.onclick = function(event) {
                if(course['ecid']!=null){
            event.preventDefault();
            window.open('http://course2020.whu.edu.cn/pc/course/studentClassRoomCourse?jsh='+course['ecid'], '_blank');}
          }
              }
    }});
 }
 function health_checkin_noti(){
    if(local_storage_load("health_checkin")!=1){
        var noti_daily_health_checkin= new Notification("每日健康签到",{body:"每日11:00点前要记得在“武大日报平安”小程序填写情况健康情况哦",icon:"https://migu.plus/t/pic/health_checkin.png",tag: 'noti_daily_health_checkin'});
        noti_daily_health_checkin.onclick = function(event) {
            local_storage_save("health_checkin",1);
  }
    }
 }
 function trigger_noti_course(){
    if(global_config['noti_course']==1){
        global_config['noti_course']=0;
        jbox_notice_1("现在上下课我就不会烦到你啦...",3,'left','fancy');
    }else{
        global_config['noti_course']=1;
        jbox_notice_1("每天上下课的时候我都会提醒你哦",1,'left','fancy');
    }
    local_storage_save("global_config",JSON.stringify(global_config));
 };

 function  trigger_noti_near_course(){
    if(global_config['noti_near_course']==1){
        global_config['noti_near_course']=0;
        jbox_notice_1("现在就算有课的话我也会安安静静的",3,'left','fancy');
    }else{
        global_config['noti_near_course']=1;
        jbox_notice_1("上课前5分钟和上课的时候我都会提醒你哦",1,'left','fancy');
    }
    local_storage_save("global_config",JSON.stringify(global_config));
 };

 noti: 1
noti_min: 1275
noti_month: 3
noti_date: 8
task_id: 5
task_title: "一个Flag"
task_content: "绝赞推进中"
task_time: "09:15 PM"
task_type: 1
task_icon: "ion-fireball"


function task_noti(){
    currentdate=date.getDate();
    currentmin=date.getHours()*60+date.getMinutes();
    currentmonth=date.getMonth()+1;
    var noti_icon;
       task_obj['task_list'].forEach(task => {
          if(task['noti']==1){
             if(task['noti_month']==currentmonth&&task['noti_date']==currentdate&&task['noti_min']<(currentmin+10)){
                noti_icon=(task['noti_icon']!=null)?task['noti_icon']:"https://migu.plus/t/pic/noti_task_finish.jpg";
                var noti_task_approching= new Notification(task['task_title'],{body:task['task_time']+"到期的计划"+task['task_content'],icon:noti_icon});
                task['noti']=0;
                noti_task_approching.onclick = function(event) {
                    event.preventDefault(); 
                    task['noti']=0;
                    local_storage_save("task_json",JSON.stringify(task_obj));
          }
             }
          }
       });
}