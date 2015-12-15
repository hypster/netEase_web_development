window.onload = function() {
    // 左侧列表默认请求
    ajax('get', 'http://study.163.com/webDev/couresByCategory.htm', 'pageNo=1&psize=20&type=10', displayCourseList);

    // 右侧列表获取
    ajax('get', 'http://study.163.com/webDev/hotcouresByCategory.htm', '', displayHotCourse);
    //上方提醒条cookie的设置
    (function() {
        var oButton = document.getElementById('notice');
        var oNotification = document.getElementById('notification');
        var res = getCookie('notice');
        if (res == '1')
            oNotification.style.display = 'none';
        else
            oNotification.style.display = 'block';
        oButton.onclick = function() {
            oNotification.style.display = 'none';
            setCookie('notice', '1', 30);
        }
    })();

    // 用户关注登录交互
    (function() {
        var oBtnFollow = document.getElementById('follow');
        var oBtnLogin = document.getElementById('login');
        var oDiv = document.getElementById('popup');
        var oMask = document.getElementById('mask');
        var user = document.getElementById('user');
        var pass = document.getElementById('pass');
        var fans = document.getElementById('fans');
        user.initValue = user.value;
        pass.initValue = pass.value;

        oBtnFollow.onclick = function(e) {
            e = makeEvent(e);
            if (Number(getCookie('loginSuc'))) {
                followCB(1);
            } else {
                showPopUp(e);
            }

        }

        function showPopUp(e) {
            oDiv.style.display = 'block';
            oMask.style.display = 'block';
            var src = e.target || e.srcElement;
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var scrollLeft = window.scrollX || document.documentElement.scrollLeft;
            var width = oDiv.offsetWidth;
            var height = oDiv.offsetHeight;
            var innerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var innerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            var x = (innerWidth - width) / 2;
            var y = (innerHeight - height) / 2;
            oDiv.style.left = x + scrollLeft + 'px';
            oDiv.style.top = y + scrollTop + 'px';
        }

        oBtnLogin.onclick = fnLogin;

        function fnLogin() {
            var value1 = md5(user.value);
            var value2 = md5(pass.value);
            ajax('get', 'http://study.163.com/webDev/login.htm', 'userName=' + value1 + '&password=' + value2,
                loginCB);
        }

        function replaceNode() {
            oDiv.style.display = 'none';
            mask.style.display = 'none';
            var newNode = document.createElement('a');
            newNode.className = 'statusFollowed';
            newNode.innerHTML = '<span class="followed">已关注 </span><span id="cancel">| 取消</span>';
            newNode.style.width = '104px';
            oBtnFollow.parentNode.replaceChild(newNode, oBtnFollow);
            fans.innerHTML = '粉丝 ' + (Number(fans.innerHTML.match(/\d+/)) + 1);
            var cancel = document.getElementById('cancel');
            cancel.onclick = function() {
                newNode.parentNode.replaceChild(oBtnFollow, newNode);
                fans.innerHTML = '粉丝 ' + (Number(fans.innerHTML.match(/\d+/)) - 1);
            }
        }

        function followCB(res) {
            if (Number(res)) {
                setCookie('followSuc', '1');
                replaceNode();
            } else {
                alert('不好意思您未关注成功，请再试一次')
            }
        }



        function loginCB(res) {
            if (Number(res)) {
                //成功设置loginSuc cookie并发送关注请求
                setCookie('loginSuc', 1)
                    // alert('loginSuc')
                ajax('get', 'http://study.163.com/webDev/attention.htm', '', followCB);
            } else {
                // 登录失败
                alert('用户名密码似乎不对哦');
            }
        }

        oMask.onclick = function() {
            this.style.display = oDiv.style.display = 'none';
        }

        // 弹窗输入提示信息隐藏
        pass.onfocus = user.onfocus = function() {
            if (this.value == this.initValue)
                this.value = '';

        }
        pass.onblur = user.onblur = function() {
            if (this.value == '') {
                this.value = this.initValue;
            }
        }

    })();


    //右侧视频占位图片点击弹出视频播放器
    (function() {
        var mask = document.getElementById('mask');
        var oImg = document.getElementById('videoPlaceHolder');
        var movie = document.getElementById('movie')
        var oA = movie.getElementsByTagName('a')[0];
        var video = movie.getElementsByTagName('video')[0];
        oImg.onclick = function(e) {
            e = makeEvent(e);
            movie.style.display = 'block';
            mask.style.display = 'block';
            mask.onclick = function() {
                video.pause();
                video.currentTime = 0;
                this.style.display = 'none';
                movie.style.display = 'none';

            }
            return false;
        }
        oA.onclick = function(e) {
            e = makeEvent(e);
            movie.style.display = 'none';
            mask.style.display = 'none';
            video.pause();
            video.currentTime = 0;
            return false;
        }
    })();


    // 更换banner
    (function() {
        var oBanner = getClass(document, 'banner')[0];
        var aLi = oBanner.getElementsByTagName('li');
        var length = aLi.length;
        var aPointer = getClass(oBanner, 'pointer');
        var current = 0;
        var timer = null;
        timer = setInterval(fnChange, 5000);
        oBanner.onmouseover = function() {
            clearInterval(timer);
        }
        oBanner.onmouseout = function() {
            timer = setInterval(fnChange, 5000);
        }

        function fnChange() {
            if (current == length)
                current = 0;
            for (var i = 0; i < aLi.length; i++) {
                fade(aLi[i], 0);
                aLi[i].style.zIndex = 0;
                removeClass(aPointer[i], 'active');
            }
            addClass(aPointer[current], 'active');
            aLi[current].style.zIndex = 1;
            fade(aLi[current], 100);
            current++;
        }
        // 点击下方圆点切换banner
        for (var i = 0; i < aPointer.length; i++) {
            aPointer[i].index = i;
            aPointer[i].onclick = function(e) {
                // clearInterval(timer);
                // makeEvent(e);
                current = this.index;
                fnChange();
            }
            aPointer[i].onfocus = function(e) {
                makeEvent(e);
            }
        }
        aPointer[0].parentNode.ondrag = function(e) {
            e = makeEvent(e);
            return false;
        }

    })();


    // ajax回调获取左侧课程列表
    function displayCourseList(data) {
        var data = JSON.parse(data);
        var oUl = document.getElementById('courseList');
        var aLi = oUl.getElementsByTagName('li');
        var length = aLi.length;
        var dataList = data.list;
        for (var i = 0; i < length; i++) {
            var temp = dataList[i];
            var oLi = aLi[i];
            var oImg = oLi.getElementsByTagName('img')[0];
            var title = getClass(oLi, 'title')[0];
            var author = getClass(oLi, 'author')[0];
            var price = getClass(oLi, 'price')[0];
            var number = getClass(oLi, 'number')[0];
            oImg.src = temp.bigPhotoUrl;
            title.innerHTML = temp.name;
            author.innerHTML = temp.provider;
            if (temp.price == '0')
                price.innerHTML = '免费';
            else
                price.innerHTML = '￥ ' + temp.price;
            number.innerHTML = temp.learnerCount;
        }

        //课程列表hover实现
        (function() {
            var oUl = document.getElementById('courseList');
            var aLi = oUl.getElementsByTagName('li');
            var hover = document.getElementById('hover');
            var oImg = document.getElementsByTagName('img')[0];
            var title = getClass(hover, 'title')[0];
            var desc = getClass(hover, 'desc')[0];
            var author = getClass(hover, 'author')[0];
            var learningCount = getClass(hover, 'learningCount')[0];
            var category = getClass(hover, 'category')[0];

            for (var i = 0; i < aLi.length; i++) {
                aLi[i].index = i;
                aLi[i].onmouseover = fnShow;
            }
            // ajax信息组装并显示
            function fnShow() {
                var l = this.offsetLeft;
                var t = this.offsetTop;
                hover.style.display = 'block';
                // 个人比较喜欢hover直接罩在原来Li的上面，因为hover内容同li基本类似，并排显示并不一定最好
                hover.style.left = l - 11 + 'px';
                hover.style.top = t - 15 + 'px';
                oImg.src = data.list[this.index].bigPhotoUrl;
                title.innerHTML = data.list[this.index].name;
                desc.innerHTML = data.list[this.index].description;
                author.innerHTML = data.list[this.index].provider;
                learningCount.innerHTML = data.list[this.index].learnerCount;
                category.innerHTML = data.list[this.index].categoryName ? data.list[this.index].categoryName : '';
                hover.onmouseover = function() {
                    hover.style.display = 'block';
                }
                hover.onmouseout = function() {
                    hover.style.display = 'none';
                }

            }


        })();
    }
    // 右侧热门课程ajax回调函数
    function displayHotCourse(data) {
        var oUl = document.getElementById('hot');
        var data = JSON.parse(data);
        var dataLength = data.length;
        var aLi = oUl.getElementsByTagName('li');
        var length = aLi.length;
        var cnt = 0;

        var timer = setInterval(fnShow, 5000)
        fnShow();
        // ajax信息组装并显示
        function fnShow() {
            if (cnt > dataLength - length)
                cnt = 0;
            for (var i = 0; i < length; i++) {
                var ele = aLi[i];
                ele.index = i;
                var oImg = ele.getElementsByTagName('img')[0];
                var oA = ele.getElementsByTagName('a')[1];
                var oSpan = ele.getElementsByTagName('span')[0];
                oImg.src = data[ele.index + cnt].smallPhotoUrl;
                oImg.alt = data[ele.index + cnt].name;
                oA.innerHTML = data[ele.index + cnt].name;
                oSpan.innerHTML = data[ele.index + cnt].learnerCount + '';
            }
            cnt++;
        }

    }
    // 课程列表获取
    (function() {
        var productDesign = document.getElementById('productDesign');
        var codeLanguage = document.getElementById('codeLanguage');
        productDesign.type = 10;
        codeLanguage.type = 20;
        var parent = document.getElementById('page');
        var aA = parent.getElementsByTagName('a');
        var hover = document.getElementById('hover');
        var type = 10;
        var current = aA[0];
        var aLi = document.getElementById('courseList').getElementsByTagName('li');
        // 点击分页器触发
        parent.onclick = function(e) {
                e = makeEvent(e);
                var target = e.target || event.srcElement;
                removeListEvent(aLi);
                while (target != parent) {
                    if (target.nodeName == 'A') {
                        removeClass(current, 'active');
                        current = target;
                        addClass(current, 'active');
                        if (type == 10)
                            return ajax('get', 'http://study.163.com/webDev/couresByCategory.htm', 'pageNo=' + target.innerHTML + '&psize=20&type=10', displayCourseList);
                        else
                            return ajax('get', 'http://study.163.com/webDev/couresByCategory.htm', 'pageNo=' + target.innerHTML + '&psize=20&type=20', displayCourseList);
                    }
                    target = target.parentNode;

                }
                return false;
            }
            // 点击tab标题触发
        function changeContent(e) {
            e = makeEvent(e);
            if (this.type == type)
                return false;
            type = this.type;
            var other = (this == productDesign ? codeLanguage : productDesign);
            addClass(this, 'current');
            removeClass(other, 'current');
            removeListEvent(aLi);
            ajax('get', 'http://study.163.com/webDev/couresByCategory.htm', 'pageNo=' + current.innerHTML + '&psize=20&type=' + this.type, displayCourseList)
            return false;
        }
        codeLanguage.onclick = productDesign.onclick = changeContent;
    })();
};
