import "./Login.css";
import { useState } from "react";

function Login() {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="loginPage">
            <div className="loginContainer">
                <h1 className="loginTitle">Find My Laundry</h1>

                <form className="loginForm">
                    <div className="loginInputGroup">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="loginInputGroup">
                        <label htmlFor="password">Password</label>
                        <div className="passwordInputWrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Enter your password"
                            />

                            <button
                                type="button"
                                className="togglePassword"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <a href="#" className="forgotPassword">
                            Forgot Password?
                        </a>
                    </div>

                    <button type="submit" className="loginButton">
                        Log In
                    </button>
                </form>
                <p className="signupText">
                    Don't have an account? <a href="#">Sign Up</a>
                </p>
            </div>
        </div>
    );
}

export default Login;