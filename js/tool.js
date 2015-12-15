  function setCookie(name, value, expire) {
      value = encodeURIComponent(value)
      name = encodeURIComponent(name);
      if (expire) {
          var date = new Date();
          date.setDate(date.getDate() + expire);
          document.cookie = name + '=' + value + ';=expires=' + date;
      } else {
          document.cookie = name + '=' + value;
      }

  }

  function getCookie(name) {
      var re = new RegExp('\\b' + name + '=\\w+');
      var res = document.cookie.match(re);
      if (res) {
          return decodeURIComponent(res[0].split('=')[1]);
      } else {
          return '';
      }
  }
  // 获取class
  function getClass(node, className) {
      if (document.getElementsByClassName)
          return node.getElementsByClassName(className);
      else {
          var res = [];
          var re = new RegExp('\\b' + className + '\\b');
          console.log(re);
          var elements = node.getElementsByTagName('*');
          for (var i = 0; i < elements.length; i++) {
              console.log(elements[i].className)
              if (re.test(elements[i].className))
                  res.push(elements[i]);
          }
          return res;
      }
  }
  // 增删查class函数
  function hasClass(ele, cls) {
      return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  }

  function addClass(ele, cls) {
      if (!hasClass(ele, cls)) ele.className += " " + cls;
  }

  function removeClass(ele, cls) {
      if (hasClass(ele, cls)) {
          var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
          ele.className = ele.className.replace(reg, ' ');
      }
  }
 



  // 获取样式函数
  function getStyle(obj, attr) {
      if (obj.currentStyle) {
          return obj.currentStyle[attr];
      } else {
          return getComputedStyle(obj, false)[attr];
      }
  }

  // 渐变运动函数
  function fade(ele, iTarget) {

      clearInterval(ele.timer);
      var opacity = parseInt(parseFloat(getStyle(ele, 'opacity')) * 100);
      ele.timer = setInterval(function() {
          var iSpeed = 0;
          if (opacity < iTarget)
              iSpeed = 5;
          else
              iSpeed = -5;
          if (Math.abs(opacity - iTarget) < 5) {
              clearInterval(ele.timer);

              ele.style.opacity = iTarget / 100;
              ele.style.filter='alpha(opacity:'+iTarget+')';
          } else {
              opacity += iSpeed;
              ele.style.opacity = opacity / 100;
              ele.style.filter='alpha(opacity:'+opacity+')';
          }
      }, 25);
  }
  // 删除左侧列表注册函数
  function removeListEvent(list) {
      for (var i = 0; i < list.length; i++) {
          list[i].onmouseover = null;
      }
  }
  //ajax请求封装
  function ajax(method, url, data, success) {
  var xhr = null;
  try {
    xhr = new XMLHttpRequest();
  } catch (e) {
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  
  if (method == 'get') {
    if(data){
      url +='?'+data;
      var t = new Date().getTime();
      url+='&'+t;  
    }
  }
  
  xhr.open(method,url,true);
  if (method == 'get') {
    xhr.send();
  } else {
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
  }
  
  xhr.onreadystatechange = function() {
    
    if ( xhr.readyState == 4 ) {
      if ( xhr.status == 200 ) {
        // alert(xhr.responseText)
        success && success(xhr.responseText);
      } else {
        alert('Err：' + xhr.status);
      }
    }
    
  }
}

function makeEvent(e){
  e=e||event;
  if(e.preventDefault)
    e.preventDefault();
  else 
    e.returnValue=false;
  return e;
}
