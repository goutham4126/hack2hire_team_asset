import { useState } from "react";
import {useNavigate} from "react-router-dom"
import toast from "react-hot-toast";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const router= useNavigate();  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registration successful");
        router("/login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Error registering:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[500px]">
      <form className="md:w-1/4 mx-auto bg-gray-100 dark:bg-gray-900 p-5 rounded" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Your email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700"
            placeholder="example@gmail.com"
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Your password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700"
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="repeat-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Repeat password
          </label>
          <input
            type="password"
            id="repeat-password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700"
            required
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Register new account
        </button>
      </form>
      <div className="mt-5 text-center"> <p className="text-sm text-gray-500 dark:text-gray-400"> Already have an account? <a href="/login" className="text-blue-600 hover:underline dark:text-blue-500">Login here</a> </p> </div>
    </div>
  );
}

export default Register;
