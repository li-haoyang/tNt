var storage;
var storage
var block_blank='<li style="float: left; width: 20%; height: 50px; box-sizing: border-box; position: relative;"></li>';
var course_json;
var course_obj;
var dic_weekday={'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'天':7};
var dic_course_startmin={'1':480,'2':530,'3':590,'4':640,'5':690,'6':845,'7':895,'8':945,'9':1000,'10':1050,'11':1110,'12':1160,'13':1210};
var time_stamp={'date':1,'month':1};
var bool_weekend=0;
var course_ecid_jbox,course_ecad_jbox,course_parse_jbox;
var course_data;

const date=new Date();
//LocalStorage course_json:课程内容；task_obj：计划内容;timetable_bg:课程表图片背景；

document.oncontextmenu = function(){return false;};

function local_storage_save(key,value){
    if(! window.localStorage){
        jbox_notice_1('该浏览器不支持LocalStorage,本页面可能不能正常运作',0,'left','fancy');
        return false;
    }else{
        localStorage.setItem(key,value);
    }
}
function local_storage_load(key){
    if(! window.localStorage){
        jbox_notice_1('该浏览器不支持LocalStorage,无法读取信息',0,'left','fancy');
        return false;
    }else{
         return localStorage.getItem(key);
    }
}
function get_minute(hour,minute){
    if(hour==-1){//currentTime
        var h = date.getHours();
        var m = date.getMinutes();
        return h*60+m;
    }else{
        return hour*60+minute;
    }
}
function bg_load(){
    var bg_data=local_storage_load("timetable_bg");
    if(bg_data!=null){
        document.getElementById('Courses-content-bg').style.backgroundImage=bg_data;
    }
}
 function changebg(){
     var bg_new=document.getElementById('timetable_bg').files[0];
     var bg_size=bg_new.size/1024;
     if(bg_size>2048){
        jbox_notice_1('背景图片不能大于2Mb','0','right','fancy');
        return false;
     }
    var reader=new FileReader();
    reader.addEventListener("load",function(){
        document.getElementById('Courses-content-bg').style.backgroundImage='url(\''+reader.result+'\')';
        local_storage_save("timetable_bg",'url(\''+reader.result+'\')');
        jbox_notice_1('新背景看起来如何？',1,'right','fancy');
})
    if(bg_new){
        reader.readAsDataURL(bg_new);
    }
    }
function get_week(){
const currentYear = date.getFullYear().toString();
const hasTimestamp = new Date() - new Date(currentYear);
const hasDays = Math.ceil(hasTimestamp / 86400000);
var term_begin=48;
return parseInt((hasDays-term_begin-1)/7)+1;
}
function get_weekday(){
const weekday=date.getDay();
return (weekday==0)?7:weekday;
}
function coursedata_parse(){
    var temp;
    var coursedata_all= [];
    $("tr:gt(0)").each(function(){
        var coursedata={};
        coursedata['course_id']=this.children.item(0).innerText;
        coursedata['course_name']=this.children.item(1).innerText;
        coursedata['course_type']=this.children.item(2).innerText;
        coursedata['course_learningtype']=this.children.item(3).innerText;
        coursedata['course_academy']=this.children.item(4).innerText;
        coursedata['course_teacher']=this.children.item(5).innerText;
        coursedata['course_credit']=this.children.item(7).innerText;
        coursedata['course_period']=this.children.item(8).innerText;
        temp=this.children.item(9).children[0].innerText;
        coursedata['course_weekday']=temp.match('(?<=周).*(?=:)')[0];
        coursedata['course_week_start']=temp.match('(?<=:).*?(?=-)')[0];
        coursedata['course_week_end']=temp.match('(?<=:).*?(?=周)')[0].match('(?<=-).*')[0];
        if(temp.match('(?<=每).*?(?=周)')[0]==1){
        coursedata['course_week_type']=0;
        }else{
        coursedata['course_week_type']=(coursedata['course_week_start']%2==1)?1:2; //双周的课程就要分奇偶周
        };
        coursedata['course_start']=temp.match('(?<=;).*?(?=-)')[0];
        coursedata['course_end']=temp.match('(?<=;).*?(?=节)')[0].match('(?<=-).*')[0];
        coursedata['course_area']=temp.match('(?<=节,).*?(?=区)')?temp.match('(?<=节,).*?(?=区)')[0]:null;
        coursedata['course_building']=temp.match('(?<=区,).*?(?=-)')?temp.match('(?<=区,).*?(?=-)')[0]:null;
        coursedata['course_classroom']=(temp.match(/\d+/g)[7]!=undefined)?temp.match(/\d+/g)[7]:null;//只要正则有/d就全返回null，去掉‘’的话？符号又报错，之后再研究
        coursedata['course_memo']=(this.children.item(10).innerText!='')?this.children.item(10).innerText:null;
    coursedata_all.push(coursedata);
        });
        course_json=JSON.stringify(coursedata_all);
        course_obj=coursedata_all;
        local_storage_save('course_json',course_json);//ls
}
function timetable_weekend_trigger(){
    if(bool_weekend!=1){
        bool_weekend=1;
        $(".weekend").slideToggle(300).promise().done(function(){        
            $(".Courses-head").children().css('width','20%');
        $(".Courses-content").find("li").css('width','20%');});
        jbox_notice_1("隐藏周末课程",0,'right','fancy');
        local_storage_save("tb_hide_weekend",true);
    }else{
        bool_weekend=0;
        $(".Courses-head").children().css('width','14.28%');
        $(".Courses-content").find("li").css('width','14.28%'); 
        $(".weekend").css('width','14.28%');
        local_storage_save("tb_hide_weekend",false);
        // setTimtout('()=>{$(".weekend").slideToggle(300);}',200);
        setTimeout(function(){
            $(".weekend").slideToggle(300);
            },2000);
            jbox_notice_1("显示周末课程",1,'right','fancy');
    }
}
function timeblock_block (cobj){
    var new_el = document.createElement('span');
    var new_el_inner=document.createElement('div');
    var new_el_outter=document.createElement('div');
    var box_height=50*(cobj['course_end']-cobj['course_start']+1)-10;
    new_el.setAttribute('cid',cobj['course_id']);
    new_el.classList.add("course-hasContent");
    // new_el.style='position: absolute; z-index: 9; width: 100%; height: 100px;left: 0px; top: 0px;';
    //new_el.style.backgroundColor=bgcolor;
    new_el.style.height=box_height+'px';


    new_el_inner.classList.add("course-inner");
    var course_inner_html=cobj['course_name'];
    //console.log(cobj['course_classroom']);
    if(cobj['course_classroom']!=null){
        course_inner_html+='</br><div id="couse_building">'+cobj['course_building']+'-'+cobj['course_classroom']+'</div>';
    }
    if(cobj['course_memo']!=null){
        course_inner_html+='</br>'+cobj['course_memo'];
    }
    new_el_inner.style.color='white';
    new_el_inner.innerHTML=course_inner_html;
    new_el_inner.style.height=box_height+'px';

    new_el_outter.classList.add("course-outter");
    var onclick_temp="course_edit_ecid_jbox("+cobj['course_id']+",\'"+cobj['course_name']+"\',"+cobj['course_building']+","+cobj['course_classroom']+");";
    if(cobj["ecid"]==undefined){
        new_el_outter.innerHTML="<p onclick="+onclick_temp+">点我添加电子课室号！<p>";
    }else{
        new_el_outter.innerHTML="<p onauxclick="+onclick_temp+">电子课室号为：<span>"+cobj['ecid']+"<span><p><a style='color:white;font-weight:bold;' href='http://course2020.whu.edu.cn/pc/course/studentClassRoomCourse?jsh="+cobj['ecid']+"'>前往签到</a>";
        new_el_outter.setAttribute('ecid',cobj["ecid"]);
    }
    if(cobj['ecad']==undefined){
        new_el_outter.innerHTML+="</br><p onclick='course_edit_ecad_jbox("+cobj['course_id']+");' >点我添加上课方式！</p>"
    }else{
        new_el_outter.innerHTML+="<p  onauxclick='course_edit_ecad_jbox("+cobj['course_id']+");'>上课方式</p>"+cobj['ecad'];
    }
    new_el_outter.style.height=box_height+'px';
    new_el_outter.style.top=-box_height+'px';
    new_el.appendChild(new_el_inner);
    new_el.appendChild(new_el_outter);

    document.getElementById('Courses-content').children[cobj['course_start']-1].children[dic_weekday[cobj['course_weekday']]-1].appendChild(new_el);
    //console.log(new_el);
}
function course_edit_ecid(){
    var ecid=$('#course_edit_ecid').val();
    var cid=$("#course_edit_cid").val();
    if(ecid!=''&&cid!=''){
        for(var i=0;i<course_obj.length;i++){
            if(cid==course_obj[i]['course_id']){
                course_obj[i]['ecid']=ecid;
                jbox_notice_1('虚拟课室号设置成功',1,'right','fancy');
                course_ecid_jbox.close();
                course_json=JSON.stringify(course_obj);
                local_storage_save('course_json',course_json);//ls
                return true;
        }}
        jbox_notice_1('虚拟课室号设置失败:课头号没有对应的课程',0,'right','fancy');
            }else{
                jbox_notice_1('虚拟课室号设置失败:请先填写完整信息再保存哦',3,'right','fancy');
            }
  }
  function course_edit_ecid_jbox(cid,cname,cbuilding,cclassroom){
    var jbox_template_1=' <div class="container"><div>\
      <div class="row">\
        <div class="input-field col s6">\
       <i class="material-icons prefix">assignment_ind</i>\
         <input value="'+ cid + '" id="course_edit_cid" type="text" class="validate" disabled>\
         <label class="active" for="course_edit_cid">课头号</label>\
     </div>\
        <div class="col s6">\
        <img src="./help_cid.png"  alt="虚拟课室号是六位数字" />\
        </div>\
      <div class="row">\
        <div class="col s12">\
          请输入<a href="http://course2020.whu.edu.cn/pc/course/studentClassRoom">虚拟课室</a>中'+cbuilding+'-'+cclassroom+'课室对应的教室号:\
          <div class="input-field inline">\
            <input id="course_edit_ecid" type="number" class="validate">\
            <label for="course_edit_ecid">课室号</label>\
            <span class="helper-text" data-error="只需要输入课室号码即可" data-success="下次就可以从页面直达课室啦">虽然点\'去上课\'会发送信息，但具体怎么签到还要看老师的要求呢</span>\
          </div>\
        </div>\
      </div>\
      <a class="btn-floating btn-large waves-effect waves-light red" style="position:absolute;right:10px;top:80%;" id="task_edit_submit_button" onclick="course_edit_ecid();"><i class="material-icons">check</i></a>\
    </div></div>';
    course_ecid_jbox= new jBox('Modal', {
  height: 400,
  width:'auto',
  title: '设定'+cname+'的虚拟课堂号',
  content: jbox_template_1,
  onCloseComplete: function () {
       this.destroy();
    }
});
course_ecid_jbox.open();
  }

  function course_edit_ecad(){
    var ecad=$('#course_edit_ecad').val();
    var cid=$("#course_edit_cid").val();
    if(ecad!=''&&cid!=''){
for(var i=0;i<course_obj.length;i++){
    if(cid==course_obj[i]['course_id']){
        course_obj[i]['ecad']=ecad;
        jbox_notice_1('上课方式设置成功',1,'right','fancy');
        course_ecad_jbox.close();
        course_json=JSON.stringify(course_obj);
        local_storage_save('course_json',course_json);//ls
        return true;
}}
jbox_notice_1('上课方式设置失败:课头号没有对应的课程',0,'right','fancy');
    }else{
        jbox_notice_1('上课方式设置失败:请先填写完整信息再保存哦',3,'right','fancy');
    }
  }

  function course_edit_ecad_jbox(cid){
    var jbox_template_2='\
      <div class="row">\
        <div class="input-field col s6">\
       <i class="material-icons prefix">assignment_ind</i>\
         <input value="'+ cid + '" id="course_edit_cid" type="text" class="validate" disabled>\
         <label class="active" for="course_edit_cid">课头号</label>\
     </div>\
    <div class="row">\
      <div class="input-field col s12">\
        <textarea id="course_edit_ecad" class="materialize-textarea"></textarea>\
        <label for="course_edit_ecad">备注上课方式，支持html标签</label>\
      </div>\
    </div>\
      <a class="btn-floating btn-large waves-effect waves-light red" style="position:absolute;right:10px;top:80%;" id="task_edit_submit_button" onclick="course_edit_ecad();"><i class="material-icons">check</i></a>\
    </div>';
    course_ecad_jbox= new jBox('Modal', {
  height: 300,
  width:500,
  title: '备注上课方式',
  content: jbox_template_2,
  onCloseComplete: function () {
       this.destroy();
    }
});
course_ecad_jbox.open();
  }

function timetable_load(){
    if(local_storage_load('course_json')==null){
        jbox_notice_1('没有找到课程数据，请先导入',2,'right','fancy');
course_parse_jbox_window();
    }else{
    course_json=local_storage_load('course_json');
    course_obj=$.parseJSON(course_json);
    course_data = $.parseJSON(course_json);
    var week=get_week();
    var week_type=week%2;
    var weekday=get_weekday();
    course_data.forEach(course => {
      course['weekly_avali']=0;
      course['daily_avali']=0;
        if(course['course_week_start']<=week&&course['course_week_end']>=week){
        if(course['course_week_type']==0||course['course_week_type']==week_type)
        course['weekly_avali']=1;
        if(dic_weekday[course['course_weekday']]==weekday){
          course['daily_avali']=1;
        }
        timeblock_block(course);
    }
    });
    var couse_content=document.getElementsByClassName('Courses-content')[0];
    for(var i=0;i<13;i++){
        couse_content.children[i].children[weekday-1].style.backgroundColor='#f2f6f7';
    }
    $('.course-hasContent').hover(function (){
        cblock_height=this.children[1].style.top;
        this.children[1].style.top='0px';
    },function (){
        this.children[1].style.top=cblock_height;
    });}
}
function course_table_parse(){
    $("body").append("<div id=\'course_table\' display=\'none\'></div>");
    var course_table_string = $("#course_table_string").val();
    $("#course_table").append(course_table_string);
    coursedata_parse();
    jbox_notice_1('解析完成！如果显示不正常，可以点击更多-导入课程表重新导入',1,'left','fancy');
    $("#course_table").remove();
    timetable_load();
    course_parse_jbox.close();
  }
function course_parse_jbox_window(){
    var jbox_template_3=' <div class="container">\
   <h4>保存课程信息</h4>\
        <p>只要在下面保存了课程信息，就可以使用课程相关的功能了！</p>\
          <h5>第一步</h5>\
          <p>登录<a onclick="window.open(\'http://bkjw.whu.edu.cn/\', \'_blank\');">教务系统</a>,进入课表界面(切换到列表模式)</p>\
            <h5>第二步</h5>\
            <img src="./help_cjson.png" style="height: 150px;width:500px;">\
            <p>F12或者右键单击表格-检查，选中整个表格,右键单击，选择“Edit as HTML”<p>\
              <h5>第三步</h5>\
              <p>\
                使用快捷键"Ctrl+A"全选然后使用Ctrl+C"复制全部内容，粘贴到下面的输入框内，点击“解析”按钮</p>\
                <h5>完成</h5>\
                <p>\
                  刷新界面，应该就可以看到课表加载出来啦！之后还可以设置虚拟课室号以及上课方式，不用担心把微信和QQ和腾讯课堂和超星学习通和腾讯会议和怎么都是腾讯的东西搞混了！\
                </p>\
                <div class="row">\
                  <div class="input-field col s10">\
                    <input placeholder="<table class=\'table listTable\'style=\'table-layout: fixed;\'>" id="course_table_string" type="text" class="validate">\
                    <label for="course_table_string" class="active">课程表的html串</label>\
                  </div>\
                  <div class=" col s2"><a class="waves-effect waves-light btn-large" onclick="course_table_parse();">解析</a></div></div>';
   course_parse_jbox= new jBox('Modal', {
  height: 'auto',
  width:'auto',
  title: '导入课程表',
  content: jbox_template_3,
  onCloseComplete: function () {
       this.destroy();
    }
});
course_parse_jbox.open();
  }
//<span class="course-hasContent" style="position: absolute; z-index: 9; width: 100%; height: 100px;
// left: 0px; top: 0px; background-color: rgb(82, 219, 154); color: rgb(255, 255, 255);">形势与政策(Ⅳ)@15208</span>