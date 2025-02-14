import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserInDB = async () => {
      if (isAuthenticated && user) {
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

          if (response.ok) {
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error checking user in DB:", error);
        }
      }
    };
    checkUserInDB();
  }, [isAuthenticated, user, getAccessTokenSilently, navigate]);

  // Handle Manual Signup/Login
  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp ? "register" : "login";
    try {
      const response = await fetch(`http://localhost:3000/todo/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const result = await response.json();
      if (response.ok) {
        navigate("/dashboard");
      } else if (response.status === 400) {
        alert(result.message);
      } else if (response.status === 402) {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isSignUp ? "Sign Up" : "Log In"}
        </h2>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          {isSignUp && (
            <input
              type="text"
              placeholder="Full Name"
              className="p-3 border rounded-md"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="p-3 border rounded-md"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border rounded-md"
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="text-center my-4 text-gray-600">or</div>

        <button
          onClick={() => loginWithRedirect()}
          className="w-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 py-2 rounded-md transition duration-200"
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
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
