var task_json ='{\
	"task_total": 1,\
	"task_list": [{\
		"task_id": 1,\
		"task_title": "开始写下第一个计划",\
		"task_content": "右键单击可以暂时移除工具栏<p><a>可以使用html标签来插入链接</a></p>点击添加计划或者修改计划试下吧！",\
		"task_time": "很久很久之前",\
		"task_type": 0,\
		"task_icon": "ion-help-buoy"\
	}]\
}';
var task_obj;
var task_obj_recycal;
var task_json_recycal;
var nocv_news_id = 0;
var nocv_news_count = 0;
var task_edit_jbox;
var task_edit_lock=false;
function task_clear_all_confirm() {
   new jBox('Notice', {
      attributes: {
         x: 'right',
         y: 'bottom'
      },
      stack: false,
      animation: {
         open: 'tada',
         close: 'zoomIn'
      },
      color: 'red',
      title: '清除全部计划',
      content: '恭喜完成所有的flag！<a onclick="task_clear_all();" style="color:#F5F4E0;text-decoration:none;">点击我可以清除上面所有计划！</a>'
   });
}
function task_clear_all() {
   task_json_recycal = task_json;
   task_json = '{\
      "task_total": 1,\
      "task_list": [{\
         "task_id": 1,\
         "task_title": "开始写下第一个计划",\
         "task_content": "右键单击可以暂时移除工具栏<p><a>可以使用html标签来插入链接</a></p>点击添加计划或者修改计划试下吧！",\
         "task_time": "很久很久之前",\
         "task_type": 0,\
         "task_icon": "ion-help-buoy"\
      }]\
   }';
   task_obj=$.parseJSON(task_json);
   local_storage_save("task_json",task_json);
   $('.event').slideUp();
   new jBox('Notice', {
      attributes: {
         x: 'right',
         y: 'bottom'
      },
      stack: false,
      animation: {
         open: 'tada',
         close: 'zoomIn'
      },
      color: 'blue',
      title: '已清除全部计划',
      content: '撕下过去的一页，开始下一段征程吧！<a onclick="task_clear_all_withdraw();" style="color:#F5F4E0;text-decoration:none;">误操作？点击我来恢复！</a>'
   });
}
function task_clear_all_withdraw() {
   task_json = task_json_recycal;
   task_obj=$.parseJSON(task_json);
   task_json_recycal = null;
   $('.event').slideDown();
   jbox_notice_1('刚刚被移除的计划已经恢复', 1, 'left', 'fancy');
   local_storage_save("task_json",task_json);//ls
}
function quote_load() {
   $.ajax({
      url: "https://migu.plus/api/quote.php", success: function (quote_json) {
         var quote_obj = JSON.parse(quote_json);
         if(quote_obj['from_who']==null||quote_obj['from_who']=='null'){
            $('#quote_author').text(quote_obj['from']);
         }else if(quote_obj['from']!=null&&quote_obj['from']!='null'){
            $('#quote_author').text(quote_obj['from_who']);
         }
         $('#quote_content').text(quote_obj['hitokoto']);
      }, error: function (xhr) {
         jbox_notice_1("获取语录信息失败： " + xhr.status + " " + xhr.statusText + "</br><a onclick='quote_load();' style='color:white;font-weight:bold;'>重试</a>", 0, 'left', 'normal');
      }
   });
}

function nocv_news_load() {
   $.ajax({
      url: "https://migu.plus/api/nocv.php", success: function (news_json) {
         var news_obj = JSON.parse(news_json);
         var confirmedCount = news_obj["newslist"][0]["desc"]["confirmedCount"];
         var foreignconfirmedIncr = news_obj["newslist"][0]["desc"]["foreignStatistics"]["confirmedIncr"];
         var confirmedIncr = news_obj["newslist"][0]["desc"]["confirmedIncr"];
         var foreignconfirmedCount = news_obj["newslist"][0]["desc"]["foreignStatistics"]['confirmedCount'];
         $("#confirmedCount").text(confirmedCount);
         $("#foreignconfirmedIncr").text(foreignconfirmedIncr);
         $("#confirmedIncr").text(confirmedIncr);
         $("#foreignconfirmedCount").text(foreignconfirmedCount);
         var nocv_news_count = news_obj['newslist'][0]['news'].length;
         for (var i = 0; i < nocv_news_count; i++) {
            var news = document.createElement('div');
            news.classList.add('nocv_news_item');
            var news_title_div = document.createElement('div');
            news_title_div.classList.add('nocv_news_title');
            var news_title = document.createElement('a');
            news_title.href = news_obj['newslist'][0]['news'][i]['sourceUrl'];
            news_title.innerHTML = news_obj['newslist'][0]['news'][i]['title'];
            news_title_div.appendChild(news_title);
            var news_summary_div = document.createElement('div');
            news_summary_div.classList.add('nocv_news_summary');
            var news_summary = document.createElement('div');
            news_summary.innerHTML = news_obj['newslist'][0]['news'][i]['summary'];
            news_summary_div.appendChild(news_summary);
            news.appendChild(news_title_div);
            news.appendChild(news_summary_div);
            document.getElementById('nocv_news_wrapper').appendChild(news);
         }
         new jBox('Tooltip', { attach: '.plus-icon', pointer: 'center', title: '疫情数据', delayOpen: 1000 });
         $('.plus-icon').click(function () { $("#nocv_panel").slideToggle("slow"); });
         setInterval(function () {
            if (nocv_news_id < nocv_news_count - 1) {
               document.getElementById('nocv_news_wrapper').style.top = parseInt(document.getElementById('nocv_news_wrapper').style.top) - 150 + "px";
               nocv_news_id++;
            } else {
               document.getElementById('nocv_news_wrapper').style.top = "0px";
               nocv_news_id = 0;
            }
         }, 7000);
      }, error: function (xhr) {
         jbox_notice_1("获取疫情信息失败： " + xhr.status + " " + xhr.statusText + "</br><a onclick='nocv_news_load();' style='color:white;font-weight:bold;'>重试</a>", 0, 'left', 'normal');
         new jBox('Tooltip', { attach: '.plus-icon', pointer: 'center', title: '暂无疫情数据' });
         return 0;
      }
   });
}

function time_load() {
   var myDate = new Date;
   var year = myDate.getFullYear();
   var mon = myDate.getMonth() + 1;
   var date = myDate.getDate();
   var h = myDate.getHours();
   var m = (parseInt(myDate.getMinutes()) < 10) ? "0" + myDate.getMinutes() : myDate.getMinutes();
   var s = (parseInt(myDate.getSeconds()) < 10) ? "0" + myDate.getSeconds() : myDate.getSeconds();
   var week = myDate.getDay();
   var weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
   $(".date-title").html(mon + "月" + date + "日" + weeks[week] + "<br>" + h + ":" + m + ":" + s);
}
function task_add(task_obj) {
   var task_template = $('<div class="event">\
<i class="ion"></i>\
<h4 class="event__point">title</h4>\
<span class="event__duration">time</span>\
<p class="event__description">\
   description\
</p>\
<span class="task-config" onauxclick="this.remove();">\
   <span class="task-config-content">\
      <div class="task-config-content-left" onclick="task_done(this.getAttribute(\'tid\'));">\
      <div class="ion-ios-checkmark" style=" font-size:30px;"></div>\
         <p>完成</p>\
      </div>\
      <div class="task-config-content-right">\
      <div class="ion-android-create" style=" font-size:30px;"></div>\
         <p>修改</p>\
      </div>\
   </span>\
<span class="glass"></span>\
</span>\
</div>');
   task_template.attr('tid', task_obj['task_id']);
   task_template.find('.event__point').html(task_obj['task_title']);
   task_template.find('.event__duration').html(task_obj['task_time']);
   task_template.find('.event__description').html(task_obj['task_content']);
   task_template.find('.task-config-content-left').attr('tid', task_obj['task_id']);
   task_template.find('.task-config-content-right').attr('tid', task_obj['task_id']);
   task_template.find('.task-config-content-right').attr('onclick', "task_edit_window(" + task_obj['task_id'] + ");");
   task_template.find('.ion').addClass(task_obj['task_icon']);
   if (task_obj['task_type'] == 1) {
      task_template.addClass('active');
      $('.events-wrapper:eq(0)').prepend(task_template);
   } else {
      $('.events-wrapper:eq(0)').append(task_template);
   }
}
function task_done(tid) {
   task_remove(tid);
   jbox_notice_1('完成一项计划了呢！</br><a onclick="task_withdraw();"  style="color:#F5F4E0;text-decoration:none;">弄错了？点我撤回</a>', 1, 'left', 'normal')
}
function task_load() {
   // if(local_storage_load('task_json')!=null){
   // task_json=local_storage_load('task_json');}else{
   //    local_storage_save("task_json",task_json);//ls
   // }
   // task_obj=$.parseJSON(task_json);
   task_obj['task_list'].forEach(task => {
      task_add(task);
   });
}
function jbox_notice_1(text, color, area, style) {
   var colors = ['red', 'green', 'blue', 'yellow'];
   if (area == 'left') {
      if (style == 'fancy') {
         new jBox('Notice', {
            theme: 'NoticeFancy',
            attributes: {
               x: 'left',
               y: 'top'
            },
            color: colors[color],
            content: text,
            animation: {
               open: 'slide:top',
               close: 'slide:left'
            }
         });
      } else {
         new jBox('Notice', {
            animation: 'flip',
            attributes: {
               x: 'left',
               y: 'top'
            },
            color: colors[color],
            content: text,
            delayOnHover: true,
            showCountdown: true
         });
      }
   } else {
      if (style == 'fancy') {
         new jBox('Notice', {
            theme: 'NoticeFancy',
            attributes: {
               x: 'right',
               y: 'top'
            },
            color: colors[color],
            content: text,
            animation: {
               open: 'slide:top',
               close: 'slide:right'
            }
         });
      } else {
         new jBox('Notice', {
            animation: 'flip',
            attributes: {
               x: 'right',
               y: 'top'
            },
            color: colors[color],
            content: text,
            delayOnHover: true,
            showCountdown: true
         });
      }
   }
}
function task_remove(tid) {
   var task_total = task_obj['task_list'].length;
   for (var i = 0; i < task_total; i++) {
      if (task_obj['task_list'][i]['task_id'] == tid) {
         task_obj_recycal = task_obj['task_list'][i];
         $("div[tid=" + tid + "]").slideUp();
         task_obj['task_list'].splice(i, 1);
         task_json=JSON.stringify(task_obj);
         local_storage_save("task_json",task_json);//ls
         break;
      }
   }
   return false;
}
function task_withdraw() {
   if (task_obj_recycal != null) {
      var task_recycle_tid = task_obj_recycal['task_id'];
      task_obj['task_list'].push(task_obj_recycal);
      $("div[tid=" + task_recycle_tid + "]").slideDown();
      task_obj_recycal = null;
      jbox_notice_1('恢复了刚刚的计划', 1, 'left', 'fancy');
      task_json=JSON.stringify(task_obj);
      local_storage_save("task_json",task_json);//ls
   } else {
      jbox_notice_1('虽然不知道发生了什么总之现在还没有可以撤回的计划。', 3, 'left', 'fancy')
   }
}
function create_task(task_id, task_title, task_content, task_time, task_type, task_icon) {
   var tid = task_obj['task_total'] + 1;
   task_obj['task_total'] = tid;
   var task_new = {};
   task_new['task_id'] = task_id;
   task_new['task_title'] = task_title;
   task_new['task_content'] = task_content;
   task_new['task_time'] = task_time;
   task_new['task_type'] = task_type;
   task_new['task_icon'] = task_icon;
   task_obj['task_list'].push(task_new);

}
function task_edit_add() {
   var tid = task_obj['task_total'] + 1;
   task_obj['task_total'] = tid;
   var task_new = {};
   var task_time=$("#task_edit_time").val();
   var task_date=$("#task_edit_date").val();
   if(task_time!=''&&task_date!=''){
      task_new['noti']=1;
      var hour=parseInt(task_time.split(':')[0]);
      var minute=parseInt(task_time.split(':')[1].split(' ')[0]);
      if(task_time.split(':')[1].split(' ')[1]=='PM'){
         hour+=12;
      }
      task_new['noti_min']=hour*60+minute;
      task_new['noti_month']=parseInt(task_date.split(' ')[0]);
      task_new['noti_date']=parseInt(task_date.split(' ')[1]);
   }
   if($("#task_noti_icon").val()!=''){
      task_new['noti_icon']=$("#task_noti_icon").val();
   }
   task_new['task_id'] = parseInt($("#task_edit_id").val());
   task_new['task_title'] = ($("#task_edit_title").val()=='')?'一个Flag':$("#task_edit_title").val();
   task_new['task_content'] = ($("#task_edit_content").val()=='')?'绝赞推进中':$("#task_edit_content").val();
   task_new['task_time'] = $("#task_edit_time").val();
   task_new['task_type'] = $("#task_edit_important").prop('checked') ? 1 : 0;
   task_new['task_icon'] = $("#task_edit_badge").val();
   if (task_new['task_id'] <= task_obj['task_total']) {
      task_remove(task_new['task_id']);
      task_obj['task_list'].push(task_new);
   } else {
      task_obj['task_list'].push(task_new);
      task_obj['task_total'] = task_new['task_id'];
   }
   task_json=JSON.stringify(task_obj);
   local_storage_save("task_json",task_json);//ls
   task_add(task_new);
   jbox_notice_1("一个新的任务<span style='font-size:15px;font-weight:bold;'>"+task_new['task_title']+"</span>加入了小本本!</br>",2,'left','fancy');
   task_edit_jbox.close();
   if (window.Notification && Notification.permission !== "granted") {
      noti_info_jbox= new jBox('Modal', {
         height: 'auto',
         width:'auto',
         title: '授权通知提醒',
         content: "如果使用主流浏览器的话，只要允许推送通知，网页就会在任务到期/上下课时间/有课程要上提前弹出消息提醒你，要不试一下？",
         onCloseComplete: function () {
            noti_permit();
              this.destroy();
           }
       });
       noti_info_jbox.open();
   }
}
function task_edit_window(tid) {
   if(task_edit_lock==true){
         jbox_notice_1('目前已经有一个计划在编辑中，将其完成或关闭后再继续吧！',3,'left','fancy');
         return false;
   }
   task_edit_lock=true;
   var task_id = (tid == "-1") ? task_obj["task_total"] + 1 : tid;
   $("#task_edit_container").find("#task_edit_id").val("tid")
   var jbox_edit_template_0 = '<div id="task_edit_container" class="container" style="overflow:hidden;">\
     <div class="row">\
       <div class="input-field col s6">\
         <i class="material-icons prefix">assignment_ind</i>\
           <input value="'+ task_id + '" id="task_edit_id" type="text" class="validate" disabled>\
           <label class="active" for="task_edit_id">计划id</label>\
       </div>\
       <div class="input-field col s6">\
         <i class="material-icons prefix">assistant</i>\
         <input value="ion-fireball" id="task_edit_badge" type="text" onfocus="this.select();" class="validate">\
         <label class="active" for="task_edit_badge">徽章</label>\
         <span class="helper-text">可以使用<a onclick="window.open(\'https:\/\/www.runoob.com\/ionic\/ionic-icon.html\', \'_blank\');">ionic icon类</a>修改标志</span>\
       </div>\
         <div class="row">\
               <div class="input-field col s6">\
                   <i class="material-icons prefix">assignment_late</i>\
                 <input id="task_edit_title" type="text" class="validate" required="required"  >\
                 <label for="task_edit_title">计划标题</label>\
                 <span class="helper-text" data-error="写个标题可以更加清晰哦" data-success="以后就靠这个找我了哦">用于区分不同计划</span>\
               </div>\
               <div class="input-field col s6">\
                   <i class="material-icons prefix">face</i>\
                 <input id="task_noti_icon" type="text" class="validate">\
                 <label for="task_noti_icon">提醒icon</label>\
                 <span class="helper-text">用于设定计划到时间时提醒的图标(可选图片链接)</span>\
               </div>\
         </div>\
         <div class="row">\
               <div class="input-field col s12" style="margin:2px;">\
                   <i class="material-icons prefix">assignment</i>\
                 <textarea id="task_edit_content" class="materialize-textarea"></textarea>\
                 <label for="task_edit_content">描述计划的内容，支持html标签</label>\
               </div>\
         </div>\
         <div class="row" style="margin-botton:0px;">\
             <div class="input-field col s4">\
               <i class="material-icons prefix">access_alarm</i>\
               <input id="task_edit_time" type="text" class="timepicker">\  \
             </div>\
             <div class="input-field col s3">\
             <input id="task_edit_date" type="text" class="datepicker">\
           </div>\
           <div class="input-field col s5" >\
           <div class="switch">\
               <label>\
                 普通\
                 <input type="checkbox" id="task_edit_important">\
                 <span class="lever"></span>\
                 重要\
               </label>\
             </div>\
         </div></div>\
         <a class="btn-floating btn-large waves-effect waves-light red" style="position:absolute;right:10px;top:80%;" id="task_edit_submit_button" onclick="task_edit_add();"><i class="material-icons">check</i></a>\
 </div>';
 task_edit_jbox = new jBox('Modal', {
      id: 'task_edit_jbox',
      width: 'auto',
      height: 'auto',
      blockScroll: false,
      open: 'flip',
      close: 'zoomOut',
      draggable: 'title',
      closeButton: true,
      content: jbox_edit_template_0,
      title: '立FLAG',
      overlay: false,
      reposition: false,
      repositionOnOpen: false,
      stack: false,
      onCloseComplete: function () {
         this.destroy();
         task_edit_lock=false;
      }
   });
   task_edit_jbox.open();
   $('.datepicker').datepicker( {format:'mm dd',autoClose:true,i18n:{monthsShort:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']}});
   //var elems = document.querySelectorAll('.datepicker');
   // var instances = M.Datepicker.init(elems,);
   $('.timepicker').timepicker({i18n:{cancel:'取消',clear:'重置',done:'选择提醒时间'}});
}
function task_course_block(cobj,minute){
   var task_template = $('<div class="event active"  onclick="window.open(\'http://course2020.whu.edu.cn/pc/course/studentClassRoomCourse?jsh='+cobj['ecid']+'\', \'_blank\');">\
   <i style="color:green;"class="ion ion-ios-circle-filled"></i>\
   <h4 class="event__point">title</h4>\
   <span class="event__duration">time</span>\
   <p class="event__description">\
      description\
   </p>\
   </div>');
      task_template.attr('cid', cobj['course_id']);
      task_template.find('.event__point').html(cobj['course_name']);
      if(minute<=0){
         task_template.find('.event__duration').html('还有'+-minute+'分钟上课');
      }else{
         task_template.find('.event__duration').html('离上课开始已过'+minute+'分钟');
      }
      task_template.find('.event__description').html(cobj['ecad']);
      $('.events-wrapper:eq(0)').prepend(task_template);
}
function course_near_check(){
   var current_minute=get_minute(-1);
   var current_weekday=date.getDay();
   var week=get_week();
   var week_type=week%2;
   var weekday=get_weekday();
   course_obj.forEach(course => {
       if(course['course_week_start']<=week&&course['course_week_end']>=week){
       if(course['daily_avali']==1&&(course['course_week_type']==week_type||course['course_week_type']==0)){
          if(dic_weekday[course['course_weekday']]==current_weekday){
             if(current_minute>=dic_course_startmin[course['course_start']]-20&&current_minute<=dic_course_startmin[course['course_start']]+20){
                   task_course_block(course,current_minute-dic_course_startmin[course['course_start']]);

            }
          }
       }
   }
   });
}

function clear_all(){
   localStorage.clear();
   jbox_notice_1('数据已经清空，请刷新页面',1,'left','fancy');
}
function tb_display_type(){
   if(local_storage_load("tb_hide_weekend")=='true'){
      bool_weekend=0;
      timetable_weekend_trigger();
   }
}
function date_stamp_load(){
   var date_stamp_json=local_storage_load("date_stamp");
   if(date_stamp_json==null){
      date_stamp_json='{"month":1,"date":1}';
   }
   var date_stamp=$.parseJSON(date_stamp_json);
   if((date.getMonth()+1)==date_stamp['month']&&date.getDate()==date_stamp['date']){
      ;//TODO
   }else{
      date_stamp['month']=date.getMonth()+1;
      date_stamp['date']=date.getDate();
      local_storage_save("health_checkin",0);
      local_storage_save("date_stamp",JSON.stringify(date_stamp));
   }
}
function global_config_load(){
   var global_config_json=local_storage_load("global_config");
   if(global_config_json==null){
      global_config_json='{"noti_course":1,"noti_near_course":1,"noti_daily_task":1}';
   }
   global_config=$.parseJSON(global_config_json);
}
function task_check(){
   currentdate=date.getDate();
   currentmin=date.getHours()*60+date.getMinutes();
   currentmonth=date.getMonth()+1;
   if(local_storage_load('task_json')!=null){
      task_json=local_storage_load('task_json');}else{
         local_storage_save("task_json",task_json);//ls
      }
      task_obj=$.parseJSON(task_json);
      task_obj['task_list'].forEach(task => {
         if(task['noti']==1){
            if(task['noti_month']==currentmonth&&task['noti_date']==currentdate&&task['noti_min']<(currentmin+30)){
               task['task_type']=1;//indentify approching task
            }
         }
      });
}
$(document).ready(function () {
   //interval initialize
   var global_config={'noti_course':1,'noti_near_course':1,'noti_daily_task':1};
   global_config_load();
   date_stamp_load();
   time_load();
   task_check();
   task_noti();
   setInterval(time_load, 1000);
   if(global_config['noti_course']==1){
      setInterval(course_near_noti, 60000);
    }
    if(global_config['noti_near_course']==1){
      setInterval(noti_course, 60000);
   }
   setInterval(task_noti, 60000);
   //Jquery listener initialize

   //Jbox initialize
   new jBox('Tooltip', { attach: '.menu-toggle', pointer: 'center', title: '更多', delayOpen: 1000 });
   new jBox('Tooltip', { attach: '.add-event-button__icon', pointer: 'center', title: '清空计划', delayOpen: 1000 });
   new jBox('Tooltip', { attach: '#timetable_week_button', pointer: 'center', title: '切换周末的显示', delayOpen: 1000 });
   new jBox('Confirm', {
      content: '清空所有数据，包括课程表，计划清单，背景图等，确定吗？',
      cancelButton: '还是算了',
      confirmButton: '我意已决'
    });
  


   //Mjq initialize
   $('.dropdown-trigger').dropdown({ alignment: 'right' ,constrainWidth:'false'});

   var global_config={'noti_course':1,'noti_near_course':1,'noti_daily_task':1};
   //Loading Request
   quote_load();
   nocv_news_load();
   task_load();
   timetable_load();
   bg_load();
   course_near_check();
    tb_display_type();
    health_checkin_noti();

   //other functions

});
