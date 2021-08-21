import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Products from "./components/product/Products";
import Home from "./components/Home";
import Sellers from "./components/seller/Sellers";
import Users from "./components/admin/Users";
import Favourites from "./components/Favourites";
import BlackList from "./components/BlackList";
import Product from "./components/product/Product";
import Seller from "./components/seller/Seller";
import User from "./components/user-details/User";
import { ToastContainer } from "react-toastify";
import { PrivateRoute } from "./auth/PrivateRoute";

import "react-toastify/dist/ReactToastify.min.css";
import "./index.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/login" render={(props) => <Login {...props} />} />
          <Route exact path="/register" component={Register} />
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/products" component={Products} />
          <PrivateRoute exact path="/user/:username" component={User} />
          <PrivateRoute
            exact
            path="/product/:productName/company/:companyName"
            component={Product}
          />
          <PrivateRoute exact path="/seller/:companyName" component={Seller} />
          <PrivateRoute exact path="/sellers" component={Sellers} />
          <PrivateRoute exact path="/users" component={Users} />
          <PrivateRoute exact path="/favourites" component={Favourites} />
          <PrivateRoute exact path="/blocked-sellers" component={BlackList} />
          <Route path="*">404 | Not Found</Route>
        </Switch>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
