from flask import Blueprint, render_template, jsonify, request, session
from datetime import datetime
#3.1创建了蓝图对象
from ihome.models import House, Order
from utils.function import is_login

order=Blueprint('order',__name__)


#3.2设置视图函数路由
@order.route('/index/')
def index():
    return 'Hello Order'


# get方法——获取对应id的房源信息，传回前端渲染
# post方法——对当前房源下订单
@order.route('/orders_info/<int:id>/',methods=['GET','POST'])
@is_login
def orders_info(id):
    if request.method=='GET':
        house=House.query.get(id)
        return jsonify(house.to_dict())
    elif request.method=='POST':
        # 获取房源的id、入住时间、离开时间
        id=request.form.get('id')
        sd=request.form.get('sd')
        ed=request.form.get('ed')
        # 创建订单对象并添加订单属性
        order=Order()
        order.house_id = int(id)
        house=House.query.filter(House.id==id).first()
        order.user_id =house.user_id
        order.house_price=house.price
        order.begin_date=datetime.strptime(sd,'%Y-%m-%d')
        order.end_date=datetime.strptime(ed,'%Y-%m-%d')
        order.days=(order.end_date-order.begin_date).days
        order.amount=order.days*order.house_price
        order.add_update()
        return jsonify({'code':200})





#客户订单页面
@order.route('/lorders/',methods=['GET'])
@is_login
def lorders():
    return render_template('lorders.html')


#客户订单传回前端
@order.route('/mylorders/',methods=['GET'])
@is_login
def mylorders():
    houses=House.query.filter(House.user_id==session.get('user_id')).all()
    house_id=[house.id for house in houses]
    orders=Order.query.filter(Order.house_id.in_(house_id))
    orders=[order.to_dict() for order in orders]
    return jsonify(orders=orders)



#我的订单页面
@order.route('/orders/',methods=['GET'])
@is_login
def orders():
    return render_template('orders.html')


# 将我的订单传回前端
@order.route('/myorders/',methods=['GET'])
@is_login
def myorders():
    user_id=session.get('user_id')
    orders=Order.query.filter(Order.user_id==user_id).all()
    orders=[order.to_dict() for order in orders[::-1]]
    return jsonify(orders=orders)



# 下订单页面
@order.route('/booking/',methods=['GET'])
@is_login
def booking():
    return render_template('booking.html')