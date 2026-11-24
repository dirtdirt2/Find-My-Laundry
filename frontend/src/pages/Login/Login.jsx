
import "./Login.css";
import { useState } from "react";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    WashingMachine,
} from "lucide-react";
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
        <main className="loginPage">
            <div className="loginScrollArea">

                <header className="loginBrand">
                    <div className="loginBrandMark">
                        <WashingMachine size={22} strokeWidth={2.2} />
                    </div>
                    <span>Find My Laundry</span>
                </header>

                <div className="loginIntro">
                    <span className="loginEyebrow">
                        WELCOME BACK
                    </span>

                    <h1 className="loginTitle">
                        Log in to your account
                    </h1>

                    <p>
                        Find and connect with laundry services around you.
                    </p>
                </div>

                <form className="loginForm" onSubmit={handleSubmit} noValidate>

                    <div className="loginInputGroup">
                        <label htmlFor="email">Email address</label>

                        <div className="loginInputWrapper">
                            <Mail size={17} className="loginInputIcon" />

                            <input
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                            />
                        </div>
                    </div>

                    <div className="loginInputGroup">
                        <label htmlFor="password">Password</label>

                        <div className="loginInputWrapper">
                            <LockKeyhole size={17} className="loginInputIcon" />

                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                            />

                            <button
                                type="button"
                                className="loginTogglePassword"
                                onClick={() => setShowPassword((visible) => !visible)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />
                                }
                            </button>
                        </div>

                        <a href="#" className="forgotPassword">
                            Forgot Password?
                        </a>
                    </div>

                    {error && (
                        <p className="loginError" role="alert">
                            {error}
                        </p>
                    )}

                    <button type="submit" className="loginButton">
                        Log In
                        <ArrowRight size={18} />
                    </button>

                </form>

                <p className="signupText">
                    Don't have an account? <a href="#">Sign Up</a>
                </p>

                <footer className="loginFooter">
                    Find your laundry, made easier.
                </footer>

            </div>
        </main>
    );
}

export default Login;
