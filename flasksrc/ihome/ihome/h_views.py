import os

from flask import Blueprint, render_template, session, jsonify, redirect, url_for, request

#3.1创建了蓝图对象
from ihome.models import User, House, Facility, Area, HouseImage
from utils.function import is_login
from utils.setting import MEDIA_PATH

house=Blueprint('house',__name__)

#3.2设置视图函数路由
@house.route('/index/',methods=['GET'])
def index():
    return render_template('index.html')


#首页加载当前用户信息
@house.route('/index_user/',methods=['GET'])
def index_user():
    if session.get('user_id'):
        user_id=session['user_id']
        user=User.query.filter(User.id==user_id).first()
        return jsonify({'code':200,'user':user.name})
    else:
        return jsonify({'code':201})

#首页加载房源轮播信息
@house.route('/house_info/',methods=['GET'])
def house_info():
    houses=House.query.order_by('-id').all()[:3]
    houses=[house.to_dict() for house in houses]

    areas=Area.query.all()
    areas=[area.to_dict() for area in areas]
    return  jsonify(houses=houses,areas=areas)

# 首页搜索按钮
@house.route('/search/',methods=['GET'])
def search():
    return render_template('search.html')

# 搜索页面城区加载
@house.route('/search_cq/',methods=['GET'])
def search_cq():
    if request.method=='GET':
        areas = Area.query.all()
        areas = [area.to_dict() for area in areas]
        return jsonify(areas=areas)

#搜索页面房源加载
@house.route('/search_info/',methods=['GET','POST'])
def search_info():
    if request.method=='GET':
        aid=request.args.get('aid')
        sd=request.args.get('sd')
        ed=request.args.get('ed')
        sk=request.args.get('sk')
        if aid:
            if sk=='price-des':
                house = House.query.filter(House.area_id == aid).order_by('-price').all()
            elif sk=='booking':
                house = House.query.filter(House.area_id == aid).order_by('-capacity').all()
            elif sk=='price-inc':
                house = House.query.filter(House.area_id == aid).order_by('price').all()
            else:
                house = House.query.filter(House.area_id == aid).order_by('-id').all()
            house=[h.to_full_dict() for h in house]
            return jsonify(houses=house)
        else:
            house = House.query.order_by('-update_time').all()
            house = [h.to_full_dict() for h in house]
            return jsonify(houses=house)


#添加新房源
@house.route('/newhouse/',methods=['GET','POST','PATCH'])
@is_login
def newhouse():
    if request.method=='GET':
        return  render_template('newhouse.html')
    elif request.method=='POST':
        title=request.form.get('title')
        price=request.form.get('price')
        area_id=request.form.get('area_id')
        address=request.form.get('address')
        room_count=request.form.get('room_count')
        acreage=request.form.get('acreage')
        unit=request.form.get('unit')
        beds=request.form.get('beds')
        deposit=request.form.get('deposit')
        min_days=request.form.get('min_days')
        max_days=request.form.get('max_days')
        facility=request.form.getlist('facility')
        i = 0
        for a in facility[:]:
            b=int(a)
            facility[i]=b
            i+=1

        house=House()
        house.user_id=session['user_id']
        house.title=title
        house.price=int(price)
        house.area_id=int(area_id)
        house.address=address
        house.room_count=int(room_count)
        house.acreage=int(acreage)
        house.unit=unit
        house.beds=beds
        house.deposit=int(deposit)
        house.min_days=int(min_days)
        house.max_days=int(max_days)
        fac_list=Facility.query.filter(Facility.id.in_(facility)).all()
        house.facilities=fac_list
        house.add_update()
        return jsonify({'code':200,'user_id':house.user_id,'id':house.id})

    elif request.method=='PATCH':
        img=request.files.get('house_image')
        path=os.path.join(MEDIA_PATH,img.filename)
        img.save(path)
        id= request.form.get('house_id')

        house=House.query.filter(House.id==id).first()
        house.index_image_url=img.filename
        house.add_update()

        house_img=HouseImage()
        house_img.house_id=id
        house_img.url=img.filename
        house_img.add_update()
        return jsonify({'code':200,})

#添加新房源页面加载信息
@house.route('/newhouse_cqpt/',methods=['GET'])
@is_login
def newhouse_cqpt():
    cq_list=[]
    pt_list=[]
    fac_list=Facility.query.all()
    area_list = Area.query.all()
    for fac in fac_list:
        pt={}
        pt['id']=fac.id
        pt['name']=fac.name
        pt_list.append(pt)
    for area in area_list:
        cq={}
        cq['id']=area.id
        cq['name']=area.name
        cq_list.append(cq)

    return jsonify({'cq_list':cq_list,'pt_list':pt_list})


#跳转房源详情页面
@house.route('/detail/',methods=['GET'])
def detail():
    return render_template('detail.html')

#房源详细信息
@house.route('/detail_info/<int:id>/',methods=['GET'])
def detail_info(id):
    house=House.query.get(id)
    return jsonify({'loginer_id':session.get('user_id'),'house':house.to_full_dict()})