import "./Login.css";
import { useState } from "react";
import { handleLogin } from "./loginFunctions";

function Login() {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();

        const result = handleLogin(email, password);

        if (!result.success) {
            setError(result.message);
            return;
        }

        setError("");
        console.log("Login form submitted successfully.");
    };

    return (
        <div className="loginPage">
            <div className="loginContainer">
                <h1 className="loginTitle">Find My Laundry</h1>

                <form className="loginForm" onSubmit={handleSubmit}>
                    <div className="loginInputGroup">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="loginInputGroup">
                        <label htmlFor="password">Password</label>
                        <div className="passwordInputWrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                    {error && (
                        <p className="loginError">{error}</p>
                    )}

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