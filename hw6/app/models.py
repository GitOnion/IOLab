from app import db


customerOrderRelation = db.Table('customerOrderRelation',
                                 db.Column('customer', db.String, db.ForeignKey('customer.company'), nullable=False),
                                 db.Column('order_id', db.Integer, db.ForeignKey('order.id'), nullable=False),
                                 db.PrimaryKeyConstraint('customer', 'order_id'))


class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(120))
    email = db.Column(db.String(120))
    firstName = db.Column(db.String(120))
    lastName = db.Column(db.String(120))
    phone = db.Column(db.String(10))
    # You need to a relationship to Address table here
    # see http://flask-sqlalchemy.pocoo.org/2.1/models/#one-to-many-relationships
    addresses = db.relationship('Address', backref='Customer', lazy='dynamic')
    orders = db.relationship('Order', backref='Customer', secondary=customerOrderRelation)

    def __repr__(self):
        return '<Customer %r>' % self.company


class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    streetAddress = db.Column(db.String(120))
    city = db.Column(db.String(120))
    state = db.Column(db.String(120))
    country = db.Column(db.String(120))
    zipCode = db.Column(db.String(5))
    customer_name = db.Column(db.Integer, db.ForeignKey('customer.company'))

    def __repr__(self):
        return '<Address "%r, %r, %r ,%r, %r">' % (self.streetAddress, self.city, self.state, self.country, self.zipCode)


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    totalSpent = db.Column(db.Integer)
    numPartsOrdered = db.Column(db.Integer)
