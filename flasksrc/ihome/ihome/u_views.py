import os
from re import fullmatch

from flask import Blueprint, request, render_template, redirect, url_for, jsonify, session

from ihome.models import db, User, House
import random

#3.1创建了蓝图对象
from utils.function import is_login
from utils.setting import MEDIA_PATH

user = Blueprint('user',__name__)

#3.2设置视图函数路由
@user.route('/index/')
def index():
    return 'Hello User'


@user.route('/create_db/')
def create_db():
    db.create_all()
    return 'success for db'

@user.route('/random/',methods=['POST'])
def rand():
    li=''
    for _ in range(4):
        i=random.randint(0,9)
        li+=str(i)
    return jsonify({'li':li})



#登录注册
@user.route('/register/',methods=['GET','POST'])
def register():
    if request.method=='GET':
        return render_template('register.html')
    elif request.method=='POST':
        phone=request.form.get('mobile')
        passwd=request.form.get('passwd')
        passwd2=request.form.get('passwd2')
        user=User.query.filter(User.phone==phone).first()
        if user:
            return jsonify({'msg':'该用户已注册'})
        elif len(phone)!=11:
            return jsonify({'msg': '手机号填写错误'})
        elif not passwd:
            return jsonify({'msg': '密码不能为空'})
        elif passwd != passwd2:
            return jsonify({'msg': '密码不一致'})
        else:
            user=User()
            user.phone=phone
            user.password=passwd
            user.add_update()
            return jsonify({'msg':'success for register'})

@user.route('/login/',methods=['GET','POST'])
def login():
    if request.method=='GET':
        return render_template('login.html')
    elif request.method=='POST':
        phone=request.form.get('mobile')
        user=User.query.filter(User.phone==phone).first()
        if  not user:
            return jsonify({'msg':'该用户未注册'})
        else:
            password=request.form.get('password')
            if not user.check_pwd(password):
                return jsonify({'msg': '密码错误'})
            else:
                session['user_id']=user.id
                return jsonify({'code':200,'msg':'success for login'})

@user.route('/logout/',methods=['GET'])
def logout():
    session.clear()
    # return jsonify({'msg':'退出成功'})
    return render_template('index.html')




#个人信息
@user.route('/my/',methods=['GET','POST'])
@is_login
def my():
    return render_template('my.html')


#展示个人信息
@user.route('/my_info/',methods=['GET'])
@is_login
def my_info():
    user=User.query.get(session['user_id'])
    return jsonify({'phone':user.phone,'name':user.name,'icon':user.avatar})


# 添加个人信息（昵称 头像）
@user.route('/profile/',methods=['GET','POST','PATCH'])
@is_login
def profile():
    if request.method=='GET':
        return render_template('profile.html')
    elif request.method=='POST':
        icon=request.files.get('avatar')
        path=os.path.join(MEDIA_PATH,icon.filename)
        icon.save(path)
        user=User.query.get(session['user_id'])
        user.avatar=icon.filename
        user.add_update()
        return jsonify({'msg':'success'})
    elif request.method=='PATCH':
        name=request.form.get('name')
        user=User.query.get(session['user_id'])
        user.name=name
        user.add_update()
        return jsonify({'msg':'success'})


# 实名认证
@user.route('/auth/',methods=['GET','POST'])
@is_login
def auth():
    if request.method=='GET':
        return render_template('auth.html')
    elif request.method=='POST':
        name=request.form.get('real_name')
        id=request.form.get('id_card')
        reg1=r'^[\u4E00-\u9fa5]{2,4}$'
        reg2=r'^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$'
        re_name=fullmatch(reg1,name)
        re_id=fullmatch(reg2,id)
        if not re_name or not re_id:
            return jsonify({'msg':'姓名或身份证格式不对'})
        else:
            user=User.query.get(session['user_id'])
            user.id_card=id
            user.id_name=name
            user.add_update()
            return jsonify({'msg':'success for auth'})


# 展示实名认证
@user.route('/auth_ever/',methods=['GET'])
@is_login
def auth_ever():
    user=User.query.get(session['user_id'])
    if user.id_card and user.id_name:
        return jsonify({'code':200,'id':user.id_card,'name':user.id_name})
    else:
        return jsonify({'code':201})


@user.route('/myhouse/',methods=['GET'])
@is_login
def myhouse():
    return render_template('myhouse.html')


# 我的房源
@user.route('/myhouse_ever/',methods=['GET','POST'])
@is_login
def myhouse_ever():
    if request.method=='GET':
        user=User.query.get(session['user_id'])
        if user.id_card and user.id_name:
            houses=House.query.filter(House.user_id==user.id).all()
            houses_list=[house.to_dict() for house in houses]
            return jsonify({'code':200,'house':houses_list})
        else:
            return jsonify({'code': 201})
