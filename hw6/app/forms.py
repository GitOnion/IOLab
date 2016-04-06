from flask.ext.wtf import Form
from wtforms import StringField, IntegerField, SelectMultipleField
from flask_wtf.html5 import EmailField
from wtforms.validators import DataRequired


class CustomerForm(Form):
    company = StringField('company', validators=[DataRequired()])
    firstName = StringField('firstName', validators=[DataRequired()])
    lastName = StringField('lastName', validators=[DataRequired()])
    email = EmailField('email', validators=[DataRequired()])
    phone = IntegerField('phone', validators=[DataRequired()])
    # Add additional Address fields here


class AddressForm(Form):
    streetAddress = StringField('streetAddress', validators=[DataRequired()])
    city = StringField('city', validators=[DataRequired()])
    state = StringField('state', validators=[DataRequired()])
    country = StringField('country', validators=[DataRequired()])
    zipCode = IntegerField('zipCode', validators=[DataRequired()])


class OrderForm(Form):
    totalSpent = IntegerField('totalSpent', validators=[DataRequired()])
    numPartsOrdered = IntegerField('numPartsOrdered', validators=[DataRequired()])
    customers = SelectMultipleField('customers', coerce=str)
