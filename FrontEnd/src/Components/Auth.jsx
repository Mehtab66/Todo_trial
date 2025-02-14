import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      // Handle sign-up logic here
      try {
        const response = await fetch("http://localhost:3000/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
          throw new Error("Failed to sign up");
        }

        const data = await response.json();
        console.log("User signed up:", data);

        // Redirect after successful sign-up
        navigate("/dashboard");
      } catch (error) {
        console.error("Error during sign-up:", error);
      }
    } else {
      // Handle login logic here
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("http://localhost:3000/todo/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            auth0Id: user.sub,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to check user in DB");
        }

        const data = await response.json();
        console.log("API Response:", data);
        if (data.user) {
          console.log("User found or created:", data.user);
        } else {
          console.log("User response missing:", data);
        }

        // Redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("Error checking user in DB:", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-indigo-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl bg-orange-400 font-bold text-center text-gray-800 mb-6">
          {isSignUp ? "Sign Up" : "Log In"}
        </h2>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-600 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200 ease-in-out transform hover:scale-105 mb-3"
          >
            {isSignUp ? "Create Account" : "Login"}
          </button>
        </form>

        <div className="text-center my-4 text-gray-600">or</div>

        <button
          onClick={() => loginWithRedirect()}
          className="w-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 py-2 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            alt="Google Logo"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </button>

        <p className="text-center text-gray-600 mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isSignUp ? "Login" : "Sign up"}
          </button>
        </p>

        {/* <button onClick={() => logout()}>Logout</button> */}
      </div>
    </div>
  );
};

export default Auth;
