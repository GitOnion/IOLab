from flask import render_template, redirect, request, url_for
from app import app, models, db
from .forms import CustomerForm, AddressForm, OrderForm


@app.route('/')
def index():
    return redirect('/home')


@app.route('/home')
def display_customer():
    customers = models.Customer.query.all()
    orders = models.Order.query.all()
    return render_template('home.html', customers=customers, orders=orders)


@app.route('/customers/<company>')
def each_customer(company):
    customer = models.Customer.query.filter_by(company=company).first_or_404()
    return render_template('each.html', customer=customer)


@app.route('/order/<id>')
def order(id):
    order = models.Order.query.filter_by(id=id).first_or_404()
    return render_template('order.html', order=order)


@app.route('/add', methods=['GET', 'POST'])
def add():
    form = CustomerForm()
    if form.validate_on_submit():
        print("yo")
        customer = models.Customer(
            company=form.company.data,
            firstName=form.firstName.data,
            lastName=form.lastName.data,
            phone=form.phone.data,
            email=form.email.data,
        )
        db.session.add(customer)
        db.session.commit()
        return redirect('/home')
    else:
        print('what')
    return render_template('add.html', form=form)


@app.route('/add_address', methods=['GET', 'POST'])
def add_address():
    form = AddressForm()
    company = request.args.get('company')
    if form.validate_on_submit():
        print('yo')
        print(company)
        address = models.Address(
            streetAddress=form.streetAddress.data,
            city=form.city.data,
            state=form.state.data,
            country=form.country.data,
            zipCode=form.zipCode.data,
            customer_name=company
        )
        db.session.add(address)
        db.session.commit()
        return redirect(url_for('each_customer', company=company))
    return render_template('add_address.html', form=form)


@app.route('/add_order', methods=['GET', 'POST'])
def add_order():
    form = OrderForm()
    # Define the choices for the OrderForm's customers (a SelectMultipleField)
    form.customers.choices = [(c.company, c.company) for c in models.Customer.query.all()]
    if form.validate_on_submit():
        print(form.customers.data)
        order = models.Order(
            totalSpent=form.totalSpent.data,
            numPartsOrdered=form.numPartsOrdered.data,
        )
        for i in form.customers.data:
            target = models.Customer.query.filter_by(company=i).first()
            order.Customer.append(target)
        db.session.add(order)
        db.session.commit()
        return redirect(url_for('display_customer'))
    return render_template('add_order.html', form=form)
