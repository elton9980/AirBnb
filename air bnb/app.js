const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

main().then(() => {
    console.log('connected to DB');
}).catch(err => {
    console.log(err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send(' i am the root');
});


app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews)


// Error Handling
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'something went wrong!' } = err;
    res.status(statusCode).render('listings/error.ejs', { err });
});

app.listen(8080, () => {
    console.log('server is listening on port 8080');
});